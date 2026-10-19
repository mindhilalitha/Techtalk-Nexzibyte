import React from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, BookOpen, Calendar, Rocket, Mic, Code, Users 
} from "lucide-react";
import { EXPLORE_FEATURES } from "../data/mockData.js";

const FEATURE_ICONS = {
  BookOpen: BookOpen,
  Calendar: Calendar,
  Rocket: Rocket,
  Mic: Mic,
  Code: Code,
  Users: Users
};

export default function ExploreTechTalk() {
  return (
    <section className="section-padding explore-techtalk-section" id="explore-tech">
      <div className="container">
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 36px auto" }}>
          <span className="section-label">
            ECOSYSTEM DIRECTORY
          </span>
          <h2 className="section-heading">One Community. Endless Possibilities.</h2>
          <p className="section-subtitle" style={{ margin: "0 auto" }}>
            Explore every facet of NexziByte TechTalk — from cutting-edge engineering research to closed-door founder summits.
          </p>
        </div>

        <div className="explore-grid">
          {EXPLORE_FEATURES.map((item) => {
            const IconComp = FEATURE_ICONS[item.icon] || Code;

            return (
              <Link 
                to={item.link} 
                key={item.id} 
                className="explore-feature-card"
                aria-label={`Explore ${item.title}`}
              >
                <div>
                  <div className="explore-card-header">
                    <div className="explore-icon-wrapper">
                      <IconComp size={18} strokeWidth={2.2} />
                    </div>
                  </div>

                  <h3 className="explore-card-title">{item.title}</h3>
                  <p className="explore-card-desc">{item.description}</p>
                </div>

                <div className="explore-card-arrow">
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
