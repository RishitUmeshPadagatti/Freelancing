// FORMATTING CURRENCIES

import { useRecoilValue, useRecoilValueLoadable } from "recoil";
import { conversionRatesAtom, selectedCurrencyAtom } from "../recoil/atoms";
import { acceptedCurrencies } from "../utils/interfaces";
import { convertNumber } from "../i18n";
import { getCurrencySymbol } from "../utils/functions";
import useChangeCurrency from "@/hooks/useChangeCurrency";

const Temp = () => {
	const selectedCurrency = useRecoilValue(selectedCurrencyAtom)
	const conversionRatesLoadable = useRecoilValueLoadable(conversionRatesAtom);
	const changeCurrency = useChangeCurrency()

	function formatCurrency(currency: acceptedCurrencies, value: number) {
        // Handle the loading state
        if (conversionRatesLoadable.state === 'loading') {
            return 'Loading...'; // Placeholder during loading
        }

        // At this point, the state is 'hasValue'
        const conversionRates = conversionRatesLoadable.contents;

        // Perform the conversion
        const result = (value / conversionRates[currency]).toFixed(2);
        return `${getCurrencySymbol(selectedCurrency)} ${convertNumber(parseFloat(result))}`;
    }

	return (<>
		<div>
			<button className="btn" onClick={() => changeCurrency(acceptedCurrencies.inr)}>INR</button>
			<button className="btn" onClick={() => changeCurrency(acceptedCurrencies.usd)}>USD</button>
			<button className="btn" onClick={() => changeCurrency(acceptedCurrencies.eur)}>EUR</button>
		</div>

		<div>{selectedCurrency}</div>
		
		<div>
			<div>{formatCurrency(acceptedCurrencies.inr, 10)}</div>
			<div>{formatCurrency(acceptedCurrencies.usd, 10)}</div>
			<div>{formatCurrency(acceptedCurrencies.eur, 10)}</div>
		</div>
	</>
	);
}

export default Temp
