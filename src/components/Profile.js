import React, { useEffect, useState, useCallback, memo } from "react";
import DarkMode from "./DarkMode/Darkmode";
import Notification from "./Notification/Notification";
import { IoMdNotifications } from "react-icons/io";
import Calendar from "./Calendar/Calendar";
import axios from "axios";
import Aos from "aos";
import "aos/dist/aos.css";

const Profile = memo(({ tasks }) => {
  const [user, setUser] = useState();
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [dialog, setDialog] = useState({
    isLoading: false,
  });

  axios.defaults.withCredentials = true;
  useEffect(() => {
    Aos.init({ duration: 1200 });
    
    axios
      .get(`${process.env.REACT_APP_API_URL}/getUser`)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/task/getTask`)
      .then((res) => {
        let temp = res.data.filter(
          (obj) =>
            obj.done === false &&
            obj.task.deadline === new Date().toISOString().split("T")[0]
        );
        setUpcomingTasks(temp);
      })
      .catch((err) => console.log(err));
  }, [tasks]);

  // console.log(upcomingTasks);

  const openNotifi = useCallback(() => {
    setDialog({ isLoading: true });
  }, []);
  
  const closeNotifi = useCallback(() => {
    setDialog({ isLoading: false });
  }, []);

  return (
    <React.Fragment>
      <div className="profile" data-aos="fade-left">
        <div className="profile-div">
          <DarkMode />
          <button
            className={`${upcomingTasks.length ? " bell" : ""}`}
            onClick={openNotifi}
          >
            <span id="noti-count">{upcomingTasks.length}</span>
            <span>
              <IoMdNotifications size={25} color="#3081D0" />
            </span>
          </button>
          <img
            title={user && `${user.userName}`}
            id="prof-img"
            src={user && `${user.picUrl}`}
            alt=""
          />
        </div>
        {dialog.isLoading && (
          <Notification
            closeNotifi={closeNotifi}
            upcomingTasks={upcomingTasks}
          />
        )}
        <Calendar />
        <div className="quote-div" data-aos="zoom-in">
          <h3>
            {user && user.email ? user.email : "Welcome to Task Manager"}
          </h3>
          <hr />
          <div className="quote-footer">
            <h4 id="auth-name">User Profile</h4>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});

export default Profile;
