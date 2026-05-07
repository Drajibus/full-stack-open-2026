const Statistics = (props) => {
  console.log(props);

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
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
      <p>all {props.good + props.neutral + props.bad}</p>
      <p>
        average{" "}
        {(props.good - props.bad) / (props.good + props.neutral + props.bad)}
      </p>
      <p>positive {props.good / (props.good + props.neutral + props.bad)} %</p>
    </div>
  );
};

export default Statistics;
