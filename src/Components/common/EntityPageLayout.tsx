import './EntityPageLayout.scss';
import { ReactNode } from 'react';

type EntityPageLayoutProps = {
  title: string;
  controls?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
};

export default function EntityPageLayout({
  title,
  controls,
  children,
  action,
  className = '',
}: EntityPageLayoutProps) {
  return (
    <div className={`formWrapper entityPageForm ${className}`.trim()}>
      <div className="formHeaderWrapper">
        <h2 className="formHeader">{title}</h2>
        {controls ? <div className="entityPageControls">{controls}</div> : null}
      </div>
      <div className="entityPageListWrapper">{children}</div>
      {action}
    </div>
  );
}
