// this is where I will create and manage  functions to deal with UI
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";

// set up modal Body
const setUpModalBody = user => {
  const div = document.createElement("div");
  const para1 = document.createElement("p");
  const para2 = document.createElement("p");
  para1.textContent = `Name:  ${user.displayName}`;
  para2.textContent = `Email:  ${user.email}`;
  div.appendChild(para1);
  div.appendChild(para2);
  return div;
};
// function to set up navbar
const setUpNavbar = user => {
  const logout = document.querySelector("#logout");
  const modalBody = document.querySelector(".modal-body");

  logout.addEventListener("click", e => {
    firebase
      .auth()
      .signOut()
      .then(function() {
        // Sign-out successful.
      })
      .catch(function(error) {
        // An error happened.
      });
  });
  modalBody.appendChild(setUpModalBody(user));
};
export { setUpNavbar };
