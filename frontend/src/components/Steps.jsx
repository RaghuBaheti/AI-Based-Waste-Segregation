const Steps = ({ currentStep }) => {
  const steps = [
    { n: 1, label: 'Upload' },
    { n: 2, label: 'Scan' },
    { n: 3, label: 'Result' },
  ];

  return (
    <div className="steps">
      {steps.map((step, i) => {
        const isActive = currentStep === step.n;
        const isCompleted = currentStep > step.n;
        const className = `step${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`;

        return (
          <div key={step.n} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className={className}>
              <div className="step-number">
                {isCompleted ? '✓' : step.n}
              </div>
              {step.label}
            </div>
            {i < steps.length - 1 && <div className="step-line" />}
          </div>
        );
      })}
    </div>
  );
};

export default Steps;
