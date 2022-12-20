import "../../Stylesheets/Bottombar.css";
import AudioPlayer from "./AudioPlayer";

function Bottombar({ handleError }) {
  return (
    <>
      <div className="bottombar">
        <AudioPlayer handleError={(e) => handleError(e)} />
      </div>
    </>
  );
}

export default Bottombar;
