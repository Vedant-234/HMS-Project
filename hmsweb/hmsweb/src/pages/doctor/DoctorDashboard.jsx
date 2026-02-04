import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

function DoctorDashboard() {
  const menu = [
    "My Appointments",
    "Patient Records",
    "Prescriptions"
  ];

  return (
    <>
      <Navbar role="Doctor" />
      <div className="row m-0">
        <div className="col-2">
          <Sidebar menu={menu} />
        </div>

        <div className="col-10 p-4">
          <h3>Doctor Dashboard</h3>

          <table className="table table-bordered mt-3">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Rahul Sharma</td>
                <td>20 Jan 2026</td>
                <td>Pending</td>
              </tr>
              <tr>
                <td>Anita Patil</td>
                <td>21 Jan 2026</td>
                <td>Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default DoctorDashboard;
