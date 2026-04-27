const statuses = ['Order Received', 'In the Kitchen', 'Sent to Delivery', 'Delivered'];

const StatusStepper = ({ currentStatus }) => {
  const currentIndex = statuses.indexOf(currentStatus);

  return (
    <div className="stepper-container">
      {statuses.map((status, index) => (
        <div key={status} className={`step-item ${index <= currentIndex ? 'active' : ''}`}>
          <div className="step-circle">{index + 1}</div>
          <div className="step-label">{status}</div>
          {index < statuses.length - 1 && <div className="step-line"></div>}
        </div>
      ))}
    </div>
  );
};

export default StatusStepper;
