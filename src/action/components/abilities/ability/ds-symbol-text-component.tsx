import { Hero } from 'forgesteel';
import { Fragment, createElement } from 'react';
import { JSX } from 'react/jsx-runtime';

interface Props {
    content?: string;
    lookFor?: 'potencies' | 'characteristics' | 'both';
}

export const findCharacteristicsInPowerRoll = (hero: Hero, powerRoll?: string) => {
    if (!powerRoll) return undefined;

    const characteristicRegex = '\\b([MARIP])\\b';
    let flags = 'g';
    const regex = new RegExp(characteristicRegex, flags);
    const characteristics = [...powerRoll.matchAll(regex)].map((str) => {
        return str[1];
    });
    const mappedCharacteristics = hero.class?.characteristics
        .filter((characteristic) =>
            characteristics.some((c) => characteristic.characteristic.startsWith(c))
        )
        .map((characteristic) => {
            return {
                [characteristic.characteristic]: characteristic.value,
            };
        })
        .reduce((acc, curr) => Object.assign(acc, curr), {});

    return mappedCharacteristics;
};

export const DrawSteelSymbolText = (props: Props) => {
    const lookFor = props.lookFor || 'both';

    const potencyRegex = '\\`?([MARIP])\\s*<\\s*\\[?(\\d+|weak|average|avg|strong)\\]?\\`?';
    const characteristicRegex = '\\b([MARIP])\\b';
    let flags = 'g';
    let regexString;

    switch (lookFor) {
        case 'potencies':
            regexString = potencyRegex;
            flags += 'i';
            break;
        case 'characteristics':
            regexString = characteristicRegex;
            break;
        case 'both':
        default:
            regexString = `${characteristicRegex}|${potencyRegex}`;
            break;
    }

    const regex = new RegExp(regexString, flags);

    const tokenize = (text: string) => {
        const results: (string | JSX.Element)[] = [];

        let i = 0;
        [...text.matchAll(regex)].forEach((str) => {
            const beforeMatch = text.slice(i, str.index);
            i = str.index + str[0].length;
            results.push(beforeMatch);

            if (str.length > 2 && str[2]) {
                // potency
                const c = str[1].toLowerCase();
                let check = str[2];
                switch (str[2].toLowerCase()) {
                    case 'weak':
                        check = 'w';
                        break;
                    case 'average':
                        check = 'v';
                        break;
                    case 'strong':
                        check = 's';
                        break;
                }
                results.push(<span className="potency">{`${c}<${check},`}</span>);
            } else {
                // characteristic
                results.push(<span className="characteristic">{str[1]}</span>);
            }
        });
        results.push(text.slice(i));
        return createElement(Fragment, {}, ...results);
    };

    const content = tokenize(props.content || '');
    return <span className="ml-1">{content}</span>;
};
