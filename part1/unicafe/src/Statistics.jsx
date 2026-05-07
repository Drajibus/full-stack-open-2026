import StatisticLine from "./StatisticLine";

const Statistics = (props) => {
  if (props.good + props.neutral + props.bad === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    );
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} units="" />
          <StatisticLine text="neutral" value={props.neutral} units="" />
          <StatisticLine text="bad" value={props.bad} units="" />
          <StatisticLine
            text="all"
            value={props.good + props.neutral + props.bad}
            units=""
          />
          <StatisticLine
            text="average"
            value={
              (props.good - props.bad) /
              (props.good + props.neutral + props.bad)
            }
            units=""
          />
          <StatisticLine
            text="positive"
            value={
              (props.good / (props.good + props.neutral + props.bad)) * 100
            }
            units="%"
          />
        </tbody>
      </table>
    </div>
  );
};

export default Statistics;
