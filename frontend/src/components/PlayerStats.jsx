import React, { useState, useEffect } from "react";

const PlayerStats = ({ player, handlePopUp }) => {
  useEffect(() => {
    document.getElementById("my_modal_4").showModal();
  }, []);

  return (
    <div className="">
      <dialog id="my_modal_4" className="modal">
        <div className="bg-secondary modal-box w-11/12 max-w-5xl">
          {player.name}
          <div className="modal-action">
            <button className="text-white blue__btn" onClick={handlePopUp}>
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default PlayerStats;
