import React from "react";

const Tabs = ({
  tabs = [
    { title: "All", filter: () => true },
    { title: "Shop", filter: ({ category }) => category === "SHOP" }
  ],
  activeTabIndex = 0,
  action = { label : "ajouter une action", url: "/"},
  onTabClick = () => console.log("action")
}) => {
  return (
    <div className="tabs" style={{overflow:"visible"}}>
      <ul>
        {tabs.map(({ title, active }, index) => (
          <li className={activeTabIndex === index ? "is-active" : ""} key={index}>
            <a onClick={() => onTabClick(index)}>{title}</a>
          </li>
        ))}
      { action.url !== "/" && <a href={action.url} className="button is-primary go-to-right" style={{transform: "translate(-5px,-5px)"}}>{action.label}</a> }

      </ul>
    </div>
  );
};

export default Tabs;
