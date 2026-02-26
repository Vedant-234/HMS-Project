import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Common
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import ForgotPassword from "./pages/ForgotPassword";

// Auth
import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import PatientDashboard from "./pages/patient/PatientDashboard";

// ================= ADMIN =================
import RegisterDoctor from "./pages/admin/doctors/RegisterDoctor";
import DoctorBySpeciality from "./pages/admin/doctors/DoctorBySpeciality";
import ChangeDoctorStatus from "./pages/admin/doctors/ChangeDoctorStatus";
import DoctorByStatus from "./pages/admin/doctors/DoctorByStatus";

import ViewAppointments from "./pages/admin/appointments/ViewAppointments";
import AssignDoctor from "./pages/admin/appointments/AssignDoctor";
import ViewVisits from "./pages/admin/visits/ViewVisits";

import AddMedicine from "./pages/admin/medicines/AddMedicine";
import ManageMedicines from "./pages/admin/medicines/ManageMedicines";
import MedicineHistory from "./pages/admin/medicines/MedicineHistory";

import AddLabTest from "./pages/admin/labtest/AddLabTest";
import ManageLabTests from "./pages/admin/labtest/ManageLabTests";
import AddLabTestResult from "./pages/admin/labtest/AddLabTestResult";
import ViewLabTestResults from "./pages/admin/labtest/ViewLabTestResults";

import ManagerViewMedicalRecords from "./pages/admin/ManagerViewMedicalRecords";

// ================= DOCTOR =================
import DoctorViewProfile from "./pages/doctor/profile/DoctorViewProfile";
import DoctorUpdateProfile from "./pages/doctor/profile/DoctorUpdateProfile";

import DoctorViewAppointments from "./pages/doctor/appointments/DoctorViewAppointments";
import UpdateAppointment from "./pages/doctor/appointments/UpdateAppointment";

import DoctorViewVisit from "./pages/doctor/visits/DoctorViewVisit";
import AddVisitNotes from "./pages/doctor/visits/AddVisitNotes";

import ViewLabtest from "./pages/doctor/labtest/ViewLabtest";
import ViewLabtestResult from "./pages/doctor/labtest/ViewLabtestResult";

import AddPrescription from "./pages/doctor/prescription/AddPrescription";
import ViewPrescription from "./pages/doctor/prescription/DoctorViewPrescription";

import CreatePatientMedicalRecord from "./pages/doctor/medical-records/CreatePatientMedicalRecord";
import ViewPatientMedicalRecord from "./pages/doctor/medical-records/ViewPatientMedicalRecord";
import UpdatePatientMedicalRecord from "./pages/doctor/medical-records/UpdateCreatePatientMedicalRecord";

// ================= PATIENT =================
import BookAppointment from "./pages/patient/appointments/BookAppointment";
import MyAppointments from "./pages/patient/appointments/MyAppointments";

import PatientProfile from "./pages/patient/profile/PatientProfile";
import MyMedicalRecords from "./pages/patient/medicalrecords/MyMedicalRecords";
import PatientLabTestResults from "./pages/patient/medicalrecords/PatientLabTestResults";

import PatientPrescriptions from "./pages/patient/PatientPrescriptions";
import PatientInvoices from "./pages/patient/PatientInvoices";

// Public
import FindDoctors from "./pages/public/FindDoctors";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/find-doctors" element={<FindDoctors />} />

        {/* Auth */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/doctor-login" element={<DoctorLogin />} />
        <Route path="/patient-login" element={<PatientLogin />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= ADMIN ================= */}
       <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["MANAGER"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />


        <Route path="/admin/doctors/register" element={<RegisterDoctor />} />
        <Route path="/admin/doctors/speciality" element={<DoctorBySpeciality />} />
        <Route path="/admin/doctors/status" element={<ChangeDoctorStatus />} />
        <Route path="/admin/doctors/status-list" element={<DoctorByStatus />} />

        <Route path="/admin/appointments/view" element={<ViewAppointments />} />
        <Route path="/admin/appointments/assign-doctor" element={<AssignDoctor />} />
        <Route path="/admin/visits/view" element={<ViewVisits />} />

        <Route path="/admin/medicines/add" element={<AddMedicine />} />
        <Route path="/admin/medicines/manage" element={<ManageMedicines />} />
        <Route path="/admin/medicines/history" element={<MedicineHistory />} />

        <Route path="/admin/labtest/add" element={<AddLabTest />} />
        <Route path="/admin/labtest/manage" element={<ManageLabTests />} />
        <Route path="/admin/labtest/result/add" element={<AddLabTestResult />} />
        <Route path="/admin/labtest/results" element={<ViewLabTestResults />} />

        <Route path="/admin/patient-medical-records" element={<ManagerViewMedicalRecords />} />

        {/* ================= DOCTOR ================= */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={["DOCTOR"]}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />


        <Route path="/doctor/profile/view" element={<DoctorViewProfile />} />
        <Route path="/doctor/profile/update" element={<DoctorUpdateProfile />} />

        <Route path="/doctor/appointment/view" element={<DoctorViewAppointments />} />
        <Route path="/doctor/appointment/update" element={<UpdateAppointment />} />

        <Route path="/doctor/visits/view" element={<DoctorViewVisit />} />
        <Route path="/doctor/visits/add" element={<AddVisitNotes />} />

        <Route path="/doctor/prescriptions/add" element={<AddPrescription />} />
        <Route path="/doctor/prescriptions/view" element={<ViewPrescription />} />

        <Route path="/doctor/labtests" element={<ViewLabtest />} />
        <Route path="/doctor/reports" element={<ViewLabtestResult />} />

        <Route path="/doctor/medical-records/add" element={<CreatePatientMedicalRecord />} />
        <Route path="/doctor/medical-records/view" element={<ViewPatientMedicalRecord />} />
        <Route
          path="/doctor/medical-records/update/:recordId"
          element={<UpdatePatientMedicalRecord />}
        />

        {/* ================= PATIENT ================= */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={["PATIENT"]}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />


        <Route path="/patient/appointments/book" element={<BookAppointment />} />
        <Route path="/patient/appointments/my" element={<MyAppointments />} />

        <Route path="/patient/profile/view" element={<PatientProfile />} />
        <Route path="/patient/medical-records/view" element={<MyMedicalRecords />} />
        <Route path="/patient/medical-records/lab-results" element={<PatientLabTestResults />} />

        <Route path="/patient/prescriptions" element={<PatientPrescriptions />} />
        <Route path="/patient/invoices" element={<PatientInvoices />} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        newestOnTop
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  );
}

export default App;
