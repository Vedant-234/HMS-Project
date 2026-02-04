import {BrowserRouter,Routes,Route} from "react-router-dom"
import Home from "./pages/Home"
import AdminDashboard from "./pages/admin/AdminDashboard"
import DoctorDashboard from "./pages/doctor/DoctorDashboard"
import PatientDashboard from "./pages/patient/PatientDashboard"
import AdminLogin from "./pages/AdminLogin"
import PatientLogin from "./pages/PatientLogin"
import DoctorLogin from "./pages/DoctorLogin"
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import AddLabTestResult from "./pages/admin/labtest/AddLabTestResult"
import ViewLabTestResults from "./pages/admin/labtest/ViewLabTestResults"
import ManagerViewMedicalRecords from "./pages/admin/ManagerViewMedicalRecords"
import PatientRegister from "./pages/PatientRegister"
import ForgotPassword from "./pages/ForgotPassword"
import BookAppointment from "./pages/patient/appointments/BookAppointment";
import MyAppointments from "./pages/patient/appointments/MyAppointments";
import PatientProfile from "./pages/patient/profile/PatientProfile";
import MyMedicalRecords from "./pages/patient/medicalrecords/MyMedicalRecords";
import PatientLabTestResults from "./pages/patient/medicalrecords/PatientLabTestResults"
import PatientPrescriptions from "./pages/patient/PatientPrescriptions"
import PatientInvoices from "./pages/patient/PatientInvoices"
import FindDoctors from "./pages/public/FindDoctors"




function App() {
  return (    
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/doctor" element={<DoctorDashboard />} />
      <Route path="/patient" element={<PatientDashboard />} />
      <Route path="/patient-login" element={<PatientLogin />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route
          path="/admin"
          element={
            <ProtectedRoute>
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
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/patient-register" element={<PatientRegister />} />
      <Route path="/patient/appointments/book" element={<BookAppointment />} />
      <Route path="/patient/appointments/my" element={<MyAppointments />} />
      <Route path="/patient/profile/view" element={<PatientProfile />} />
      <Route path="/patient/medical-records/view" element={<MyMedicalRecords />} />
      <Route path="/patient/medical-records/lab-results"element={<PatientLabTestResults />}/>
      <Route path="/admin/labtest/result/add" element={<AddLabTestResult />}/>
      <Route path="/admin/labtest/results" element={<ViewLabTestResults />}/>
      <Route path="/admin/patient-medical-records" element={<ManagerViewMedicalRecords />}/>
      <Route path="/patient/prescriptions" element={<PatientPrescriptions />}/>
      <Route path="/patient/invoices" element={<PatientInvoices />}/>
      <Route path="/find-doctors" element={<FindDoctors />} />
    </Routes>
    <ToastContainer
    position="top-right"
    autoClose={2000}
    hideProgressBar={false}
    newestOnTop
    closeOnClick
    pauseOnHover
    draggable
    />  
  </BrowserRouter>
)
}

export default App
