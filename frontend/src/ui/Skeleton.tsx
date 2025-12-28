import React from 'react';

type SkeletonProps = {
  height?: number | string;
  width?: number | string;
  radius?: number | string;
  className?: string;
};

const Skeleton: React.FC<SkeletonProps> = ({ height = 14, width = '100%', radius = 12, className }) => {
  const style = {
    height,
    width,
    borderRadius: radius,
  };
  return <div className={['ui-skeleton', className].filter(Boolean).join(' ')} style={style} />;
};

export default Skeleton;
