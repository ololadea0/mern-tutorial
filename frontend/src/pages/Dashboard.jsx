import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Spinner from "../components/Spinner";
import GoalForm from "../components/GoalForm";
import { getGoals, reset } from "../features/goals/goalSlice";
import GoalItem from "../components/GoalItem";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ← For SENDING actions

  // Get data FROM Redux store
  const { user } = useSelector((state) => state.auth);
  const { goals, isLoading, isError, message } = useSelector(
    (state) => state.goals,
  );

  useEffect(() => {
    if (isError) {
      // Optionally show a toast or alert here
      console.log(message);
    }

    if (!user) {
      navigate("/login"); // Redirect if not logged in
      return;
    }

    dispatch(getGoals()); // ← DISPATCH action to fetch goals

    return () => {
      dispatch(reset()); // Clean up
    };
  }, [user, navigate, isError, message, dispatch]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>
        <p>This is your dashboard.</p>
      </section>

      <GoalForm />
      <section className="content">
        {goals.length > 0 ? (
          <div className="goals">
            {/* Loop through goals from Redux store */}
            {goals.map((goal) => (
              <GoalItem key={goal._id} goal={goal} />
            ))}
          </div>
        ) : (
          <h3>No goals found.</h3>
        )}
      </section>
    </>
  );
}

export default Dashboard;
