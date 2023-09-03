import MainContent from "./Components/Contents/MainContent";
//import { authCont } from "./Components/Services/AuthContext";

function App() {
  //főoldal ahol lehet nézni az autókat
  //admin adhat hozzá, vagy törölhet autókat, a login, meg ezek az mind mvc felépítés
  //de szimuláltan, TEHÁT nem lessz adatbázis, meg az ahhoz tartozó dolgok
  //a felhasználó simán névvel beléphet, és hozzá vannak kötve a bérlések
  //bérelhet egyszerre több autót is

  /*
  const authC = useContext(authCont);

  if (authC.isAuth == null) return <Loading />;
  */

  return (
    <>
      <MainContent />
    </>
  );
}

export default App;
