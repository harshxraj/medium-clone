import React from "react";
import { Link } from "react-router-dom";
import { getFullDay } from "../../common/Date";

const AboutUser = ({ className, bio, social_links, joinedAt }) => {
  return (
    <div className={`md:w-[90%] md:mt-7 ${className}`}>
      <p className="text-xl leading-7">
        {bio.length ? bio : "Nothing to read here!"}
      </p>

      <div className="flex gap-x-7 gap-y-2 flex-wrap my-2 mt-2 text-dark-grey items-center">
        {Object.keys(social_links).map((key) => {
          let link = social_links[key];
          return link ? (
            <Link target="_blank" key={key} to={link}>
              <i
                className={`fi ${
                  key != "website" ? `fi-brands-${key}` : "fi-rr-globe"
                } text-2xl hover:text-black`}
              ></i>
            </Link>
          ) : (
            ""
          );
        })}
      </div>

      <p className="text-xl leading-7 text-dark-grey">
        Member since {getFullDay(joinedAt)}
      </p>
    </div>
  );
};

export default AboutUser;
