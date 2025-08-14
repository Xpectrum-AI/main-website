import React, { Fragment } from "react";
import ChannelIcon from "../ui/ChannelIcon";
import {
  MessageSquare,
  Mail,
  Phone,
  MessageCircle,
  Globe,
  Shield,
  Target,
  RefreshCcw,
} from "lucide-react";
import styles from "../css/Panel.module.css";

type ChannelDef = {
  id: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
};

const channels: ChannelDef[] = [
  { id: "shield", Icon: Shield, label: "Compliant with industry standards" },
  { id: "target", Icon: Target, label: "Above human-level accuracy" },
  { id: "refreshcw", Icon: RefreshCcw, label: "One platform to automate many workflows" }
];

function renderLabelWithLinebreaks(label: string) {
  if (!label.includes("\n")) return label;
  return (
    <>
      {label.split("\n").map((line, i) => (
        <Fragment key={i}>
          {line}
          {i < label.split("\n").length - 1 && <br />}
        </Fragment>
      ))}
    </>
  );
}

const FeatureSection: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
      

      <div
        className={`${styles.panel} rounded-2xl overflow-hidden mx-auto`}
        role="region"
        aria-label="channels"
      >
        {/* animated blobs (panel-scoped) - using CSS module classes */}
        <div className={styles.gradientsContainer} aria-hidden>
          <div className={styles.g1} />
          <div className={styles.g2} />
          <div className={styles.g3} />
          <div className={styles.g4} />
          <div className={styles.g5} />
          <div className={styles.interactive} />
        </div>

        <div className="max-w-[1200px] flex justify-center justify-items-center mx-auto px-8 py-16 relative z-10">
          <div
            className="
                grid
                grid-cols-2 sm:grid-cols-3 md:grid-cols-5 
                gap-y-8 gap-x-6 
                items-center 
                justify-center 
                justify-items-center 
                mx-auto
            "
            role="list"
            aria-label="communication channels"
            >
            {channels.map((c) => {
                const WrappedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (p) => (
                <c.Icon {...p} strokeWidth={1.6} />
                );

                return (
                <div key={c.id} role="listitem" className="w-full flex justify-center">
                    <ChannelIcon
                    icon={WrappedIcon}
                    label={renderLabelWithLinebreaks(c.label)}
                    />
                </div>
                );
            })}
            </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
