import React, { useEffect, useState } from "react";
import Tile from "./Tile";
import "../../../Stylesheets/HomeView.css";
import axios from "axios";
import { useAllPlaylists} from '../../../Hooks/SongProvider' 

function HomeView() {
  const {allPlaylists} = useAllPlaylists()

  return (
    <>
      <div className="row recently-played">
        <h2 className="row-title">All playlists</h2>
        <div className="tiles-container">
          <Tile title={"Songs"} playlist_id={0}/>
          {allPlaylists.map((tile) => {
            return (
              <Tile key={tile.playlist_id} title={tile.playlist_name} playlist_id={tile.playlist_id}/>
            )
          })}
        </div>
      </div>
    </>
  );
}

export default HomeView;
