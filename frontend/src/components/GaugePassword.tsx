/* eslint-disable react/prop-types */

import React, { useState, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { RFMCustom } from './ReactFormMaker/interfaces/CustomInputFieldElementParams';

type GaugePasswordProps = {
  exemple?: string;
};

function GaugePassword(params: RFMCustom<GaugePasswordProps>) {
  const { zFields, props } = params;

  // Définir une valeur par défaut pour valuePassword
  const valuePassword = zFields?.value ?? '';

  // Appeler les hooks avant toute condition
  const [jogeState, setJogeState] = useState({
    text: 'Faible',
    color: 'grey',
  });

  const regex = useMemo(
    () => [/[a-z]/, /[A-Z]/, /[0-9]/, /[^a-zA-Z0-9]/, /.{8,}/, /.{12,}/],
    [],
  );

  const text = useMemo(
    () => [
      { text: 'Faible', color: 'red' }, // 0-1
      { text: 'Moyen', color: 'orange' }, // 2-3
      { text: 'Fort', color: 'green' }, // 4-5
      { text: 'Très Fort', color: 'blue' }, // 6+
    ],
    [],
  );

  useEffect(() => {
    const score = regex.reduce(
      (acc, reg) => acc + (reg.test(valuePassword) ? 1 : 0),
      0,
    );
    const newState = text[Math.min(Math.floor(score / 2), text.length - 1)];

    if (
      jogeState.text !== newState.text ||
      jogeState.color !== newState.color
    ) {
      setJogeState(newState);
    }
  }, [valuePassword, regex, text, jogeState]);

  const barsToColor = regex.reduce(
    (acc, reg) => acc + (reg.test(valuePassword) ? 1 : 0),
    0,
  );

  // Vérifier formField après l'appel des hooks
  if (!zFields) return null;

  return (
    <div className="flex gap-2 ">
      <div className="gap-2 flex items-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={uuidv4()}
            className="h-[21px] w-[21px] rounded-[4px] transition-all duration-300"
            style={{
              background: i < barsToColor ? jogeState.color : 'gray',
            }}
          />
        ))}
      </div>
      <span>{jogeState.text}</span>
      {props?.exemple && <span>{` ${props.exemple}`}</span>}
    </div>
  );
}

export default GaugePassword;
