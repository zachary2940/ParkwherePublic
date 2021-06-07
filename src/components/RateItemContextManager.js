import React, { useState, useEffect, useRef, useContext } from "react";
export const RateItemContext = React.createContext({
	rateItem: {},
	setRateItem: () => { }
});

export const RateItemContextProvider = () => {
	const [rateItem, setRateItem] = useState('')
	const rateItemValue = { rateItem, setRateItem };
	return (<LocationContext.Provider value={rateItemValue} />
	)
}