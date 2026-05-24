import React from 'react';
import smartBall from '../../assets/svg/smartBall.png';
type MatchListPageLayoutProps = {
  title: string;
  controls?: React.ReactNode;
  children: React.ReactNode;
  listRef?: React.RefObject<HTMLUListElement | null>;
};

export default function MatchListPageLayout({
  title,
  controls,
  children,
  listRef,
}: MatchListPageLayoutProps) {  return (
    <div className="prognosesForm">
      <div className="formHeaderWrapper prognosesHeaderWrapper">
        <img src={smartBall} alt="" className="logo" />
        <h2 className="formHeader">{title}</h2>
      </div>
      {controls}
      <ul ref={listRef} className="prognoses__list">
        {children}
      </ul>
    </div>
  );
}
