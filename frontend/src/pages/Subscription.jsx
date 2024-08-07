import React, { useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useQuery } from "@tanstack/react-query";
import TopNav from "../components/TopNav";
import styles from "../components/Subscribe.module.css";
import { useNavigate } from "react-router-dom";

const Subscription = () => {
  const fetchData = useFetch();
  const accessToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const { data: subscribeData, refetch: subscribeRefetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      return await fetchData(
        "/subscribe/create-checkout-session",
        "POST",
        undefined,
        accessToken
      );
    },
    enabled: false,
  });

  useEffect(() => {
    if (subscribeData) {
      window.location = subscribeData.url;
    }
  }, [subscribeData]);

  const returnToPage = () => {
    navigate("/board");
  };

  return (
    <>
      <TopNav />
      <div className={styles.background}>
        <div className={styles.subscription}>
          <div className="h3 text-center">
            Seamless Scheduling, Anytime, Anywhere
          </div>
          <div className="text-center">
            Our subscription plan is your ultimate tool for managing chores and
            tasks. Effortlessly plan, schedule, and assign tasks from anywhere
            at any time.
          </div>
          <div className={styles.grid}>
            <div className={styles.pricecard}>
              <div className={styles.pricing}>
                <div className="h4">Basic Plan</div>
                <div>
                  <span className="h1">$0</span> per year
                </div>
                <div>Perfect if you don't have many chores. Lucky you.</div>
              </div>
              <button className={styles.subscribe} onClick={returnToPage}>
                Get Started
              </button>
              <div className={styles.pricing}>
                <div className="border-top"></div>
                <div className="h4 mt-4">Features</div>
                <div>
                  <i className={`bi bi-check-circle-fill ${styles.icon}`}></i>{" "}
                  Create, edit and delete tasks.
                </div>
                <div>
                  <i className={`bi bi-check-circle-fill ${styles.icon}`}></i>{" "}
                  View all tasks in weekly calendar view.
                </div>
                <div>
                  <i className={`bi bi-check-circle-fill ${styles.icon}`}></i>{" "}
                  Manage team members.
                </div>
              </div>
            </div>
            <div className={styles.pricecard}>
              <div className={styles.pricing}>
                <div className={styles.title}>
                  <div className="h4">Pro Plan</div>
                  <div className={styles.pillshape}>Popular</div>
                </div>
                <div>
                  <span className="h1">$99</span> per year
                </div>
                <div>Perfect if you have many chores. Oh poor you.</div>
              </div>
              <button onClick={subscribeRefetch} className={styles.subscribe}>
                Get Started
              </button>
              <div className={styles.pricing}>
                <div className="border-top"></div>
                <div className="h4 mt-4">Features</div>
                <div>
                  <i className={`bi bi-check-circle-fill ${styles.icon}`}></i>{" "}
                  All free plan features.
                </div>
                <div>
                  <i className={`bi bi-check-circle-fill ${styles.icon}`}></i>{" "}
                  Manage recurring tasks.
                </div>
                <div>
                  <i className={`bi bi-check-circle-fill ${styles.icon}`}></i>{" "}
                  Schedule team member on rotation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Subscription;
