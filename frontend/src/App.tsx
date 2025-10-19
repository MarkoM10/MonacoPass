import AlertDialog from "./components/AlertDialog";
import Spinner from "./components/Spinner";
import ReservationWizard from "./pages/ReservationWizzard";

function App() {
  return (
    <div className="App min-h-screen bg-[url(./images/racetrackbg.png)] bg-cover bg-center">
      <AlertDialog />
      <Spinner />
      <ReservationWizard />
    </div>
  );
}

export default App;
