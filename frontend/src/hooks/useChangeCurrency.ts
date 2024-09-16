import { selectedCurrencyAtom } from '@/recoil/atoms'
import { useSetRecoilState } from 'recoil'
import { acceptedCurrencies } from '@/utils/interfaces'

const useChangeCurrency = () => {
    const setSelectedCurrency = useSetRecoilState(selectedCurrencyAtom)

    return (input: acceptedCurrencies) => {
        if (localStorage.getItem("currency") !== input) {
            localStorage.setItem("currency", input);
            setSelectedCurrency(input);
        }
    };
}

export default useChangeCurrency
