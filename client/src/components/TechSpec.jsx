import React from 'react';

const TechSpec= ({techSpec}) =>(
  <div className="tech">
    <ul>
      <li className="techSpec">
        <span id="types">{techSpec && techSpec.types}</span> 
        <span id="descrip">{techSpec && techSpec.description}</span>
      </li>
    </ul>
  </div>
)

export default TechSpec;