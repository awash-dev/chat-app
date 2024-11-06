import Navbar from "../components/Navbar";
import Search from "./Search";
import Chates from "./Chats";

const Sidebar = () => {
  return (
    <div className="Sidebar">
      <Navbar />
      <Search />
      <Chates />
    </div>
  );
};

export default Sidebar;
