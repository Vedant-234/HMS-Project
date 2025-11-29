-- Fully ordered HMS SQL script (no ENGINE/CHARSET settings)
CREATE DATABASE IF NOT EXISTS hms_db;
USE hms_db;

-- 1) user_account
CREATE TABLE user_account (
  userid INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('manager','doctor','patient') NOT NULL,
  mobile VARCHAR(20),
  email VARCHAR(150),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_user_role CHECK (role IN ('manager','doctor','patient'))
);

-- 2) manager
CREATE TABLE manager (
  managerid INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mobile VARCHAR(20),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userid) REFERENCES user_account(userid)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- 3) doctor
CREATE TABLE doctor (
  doctorid INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  gender VARCHAR(20),
  speciality VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  mobile VARCHAR(20),
  image VARCHAR(255),
  status ENUM('active','retired','left','holiday') NOT NULL DEFAULT 'active',
  consultation_duration INT NOT NULL DEFAULT 30,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userid) REFERENCES user_account(userid)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT chk_consultation_duration_positive CHECK (consultation_duration > 0)
);

-- 4) patient
CREATE TABLE patient (
  patientid INT AUTO_INCREMENT PRIMARY KEY,
  userid INT NOT NULL UNIQUE,
  firstname VARCHAR(100) NOT NULL,
  lastname VARCHAR(100) NOT NULL,
  gender VARCHAR(20),
  dateofbirth DATE,
  mobile VARCHAR(20),
  email VARCHAR(150),
  address VARCHAR(255),
  image VARCHAR(255),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userid) REFERENCES user_account(userid)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT ux_patient_contact UNIQUE (email, mobile)
);

-- 5) medicine_record
CREATE TABLE medicine_record (
  medicineid INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  type VARCHAR(50),
  image VARCHAR(255),
  quantity INT NOT NULL DEFAULT 0,
  expiry_date DATE,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  managerid INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  modified_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (managerid) REFERENCES manager(managerid) ON DELETE SET NULL,
  CONSTRAINT chk_med_quantity_nonneg CHECK (quantity >= 0),
  CONSTRAINT chk_med_price_nonneg CHECK (price >= 0)
);

-- 6) labtest
CREATE TABLE labtest (
  testid INT AUTO_INCREMENT PRIMARY KEY,
  testname VARCHAR(150) NOT NULL,
  description VARCHAR(500),
  image VARCHAR(255),
  managerid INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  lab_test_fees DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (managerid) REFERENCES manager(managerid) ON DELETE SET NULL
);

-- 7) patient_medical_record
CREATE TABLE patient_medical_record (
  recordid INT AUTO_INCREMENT PRIMARY KEY,
  patientid INT NOT NULL,
  doctorid INT NOT NULL,
  testid INT NULL,
  diagnosis VARCHAR(2000),
  treatment_plan VARCHAR(2000),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (patientid) REFERENCES patient(patientid) ON DELETE CASCADE,
  FOREIGN KEY (doctorid) REFERENCES doctor(doctorid) ON DELETE RESTRICT,
  FOREIGN KEY (testid) REFERENCES labtest(testid) ON DELETE SET NULL
);

-- 8) appointment
CREATE TABLE appointment (
  appointmentid INT AUTO_INCREMENT PRIMARY KEY,
  patientid INT NOT NULL,
  doctorid INT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status ENUM('scheduled','cancelled','no-show','attended') NOT NULL DEFAULT 'scheduled',
  notes VARCHAR(2000),
  FOREIGN KEY (patientid) REFERENCES patient(patientid) ON DELETE CASCADE,
  FOREIGN KEY (doctorid) REFERENCES doctor(doctorid) ON DELETE CASCADE,
  CONSTRAINT chk_appointment_status CHECK (status IN ('scheduled','cancelled','no-show','attended')),
  CONSTRAINT ux_doctor_schedule UNIQUE (doctorid, scheduled_at)
);

-- 9) visit
CREATE TABLE visit (
  visitid INT AUTO_INCREMENT PRIMARY KEY,
  patientid INT NOT NULL,
  doctorid INT NULL,
  appointmentid INT NULL,
  visit_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  visit_type VARCHAR(50),
  reason VARCHAR(1000),
  status ENUM('cancelled','no-show','attended') NOT NULL DEFAULT 'attended',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientid) REFERENCES patient(patientid) ON DELETE CASCADE,
  FOREIGN KEY (doctorid) REFERENCES doctor(doctorid) ON DELETE SET NULL,
  FOREIGN KEY (appointmentid) REFERENCES appointment(appointmentid) ON DELETE SET NULL,
  CONSTRAINT chk_visit_status CHECK (status IN ('cancelled','no-show','attended'))
);

-- 10) prescription
CREATE TABLE prescription (
  prescriptionid INT AUTO_INCREMENT PRIMARY KEY,
  recordid INT NOT NULL,
  patientid INT NOT NULL,
  doctorid INT NOT NULL,
  date_issued DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  medicine_fees DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  notes VARCHAR(2000),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (recordid) REFERENCES patient_medical_record(recordid) ON DELETE CASCADE,
  FOREIGN KEY (patientid) REFERENCES patient(patientid) ON DELETE CASCADE,
  FOREIGN KEY (doctorid) REFERENCES doctor(doctorid) ON DELETE RESTRICT,
  CONSTRAINT chk_prescription_fees_nonneg CHECK (medicine_fees >= 0)
);

-- 11) prescription_line_items
CREATE TABLE prescription_line_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prescriptionid INT NOT NULL,
  medicineid INT NOT NULL,
  dosage VARCHAR(200) NOT NULL,
  duration VARCHAR(100),
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  line_total DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (prescriptionid) REFERENCES prescription(prescriptionid) ON DELETE CASCADE,
  FOREIGN KEY (medicineid) REFERENCES medicine_record(medicineid) ON DELETE RESTRICT,
  CONSTRAINT chk_presc_qty_positive CHECK (quantity > 0),
  CONSTRAINT chk_presc_unitprice_nonneg CHECK (unit_price >= 0),
  CONSTRAINT chk_presc_linetotal_nonneg CHECK (line_total >= 0)
);

-- 12) labtest_result
CREATE TABLE labtest_result (
  labid INT AUTO_INCREMENT PRIMARY KEY,
  testid INT NOT NULL,
  recordid INT NULL,
  result_date DATETIME,
  findings TEXT,
  lab_test_fees DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (testid) REFERENCES labtest(testid) ON DELETE RESTRICT,
  FOREIGN KEY (recordid) REFERENCES patient_medical_record(recordid) ON DELETE SET NULL,
  CONSTRAINT chk_lab_fees_nonneg CHECK (lab_test_fees >= 0)
);

-- 13) invoice
CREATE TABLE invoice (
  invoiceid INT AUTO_INCREMENT PRIMARY KEY,
  patientid INT NOT NULL,
  prescriptionid INT NULL,
  labid INT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  doctor_fees DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  medicine_fees DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  labtest_fees DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  subtotal DECIMAL(16,2) NOT NULL DEFAULT 0.00,
  nettotal DECIMAL(16,2) NOT NULL DEFAULT 0.00,
  payment_status ENUM('unpaid','partial','paid') NOT NULL DEFAULT 'unpaid',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientid) REFERENCES patient(patientid) ON DELETE RESTRICT,
  FOREIGN KEY (prescriptionid) REFERENCES prescription(prescriptionid) ON DELETE SET NULL,
  FOREIGN KEY (labid) REFERENCES labtest_result(labid) ON DELETE SET NULL,
  CONSTRAINT chk_invoice_amounts_nonneg CHECK (doctor_fees >= 0 AND medicine_fees >= 0 AND labtest_fees >= 0 AND subtotal >= 0 AND nettotal >= 0),
  CONSTRAINT chk_payment_status CHECK (payment_status IN ('unpaid','partial','paid'))
);

-- 14) invoice_line_items
CREATE TABLE invoice_line_items (
  lineitemid INT AUTO_INCREMENT PRIMARY KEY,
  invoiceid INT NOT NULL,
  itemtype VARCHAR(50) NOT NULL,
  itemrefid INT NULL,
  description VARCHAR(500),
  unitprice DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  quantity INT NOT NULL DEFAULT 1,
  linetotal DECIMAL(16,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (invoiceid) REFERENCES invoice(invoiceid) ON DELETE CASCADE,
  CONSTRAINT chk_invoice_line_nonneg CHECK (unitprice >= 0 AND quantity > 0 AND linetotal >= 0)
);

-- 15) payment
CREATE TABLE payment (
  paymentid INT AUTO_INCREMENT PRIMARY KEY,
  invoiceid INT NOT NULL,
  totalamount DECIMAL(16,2) NOT NULL,
  paymentdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  paymentmethod VARCHAR(50),
  transactionref VARCHAR(200),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (invoiceid) REFERENCES invoice(invoiceid) ON DELETE CASCADE,
  CONSTRAINT chk_payment_amount_nonneg CHECK (totalamount >= 0)
);

-- Indexes
CREATE INDEX idx_patient_name ON patient (lastname, firstname);
CREATE INDEX idx_patient_mobile ON patient (mobile);
CREATE INDEX idx_doctor_name ON doctor (name);
CREATE INDEX idx_appointment_doctor ON appointment (doctorid);
CREATE INDEX idx_appointment_patient ON appointment (patientid);
CREATE INDEX idx_invoice_patient ON invoice (patientid);
CREATE INDEX idx_prescription_patient ON prescription (patientid);
CREATE INDEX idx_medicalrecord_patient ON patient_medical_record (patientid);







