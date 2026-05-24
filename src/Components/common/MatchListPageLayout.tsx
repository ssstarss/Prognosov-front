import React from 'react';
import smartBall from '../../assets/svg/smartBall.png';
type MatchListPageLayoutProps = {
  title: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
};

export default function MatchListPageLayout({
  title,
  controls,
  children,
}: MatchListPageLayoutProps) {
  return (
    <div className="prognosesForm">
      <div className="formHeaderWrapper prognosesHeaderWrapper">
        <img src={smartBall} alt="" className="logo" />
        <h2 className="formHeader">{title}</h2>
      </div>
      {controls}
      <ul className="prognoses__list">{children}</ul>
    </div>
  );
}
