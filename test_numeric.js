// Test script to verify new numeric-answer questions for Level 1
const tools = {
    shift: (text, amount = 1) => text.replace(/[a-zA-Z0-9]/g, c => {
        if (c >= '0' && c <= '9') return String((parseInt(c, 10) - amount + 10) % 10);
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base - amount + 26) % 26) + base);
    }),
    reverse: text => text.split('').reverse().join(''),
    noise: text => text.replace(/[^a-zA-Z0-9\s]/g, ''),
    swap: text => {
        const arr = text.split('');
        for (let i = 0; i < arr.length - 1; i += 2) {
            const temp = arr[i]; arr[i] = arr[i+1]; arr[i+1] = temp;
        }
        return arr.join('');
    }
};

// New numeric-answer questions to replace some word-answer ones
const newNumericQuestions = [
    // E7: replace VORTEX(reverse) -> numeric reverse
    { id: 'E7', cipher: '08642', solution: '24680', type: 'reverse' },
    // E10: replace TITAN(swap) -> numeric swap
    // swap('13579'): 1<->3, 5<->7, 9 stays => '31759'
    { id: 'E10', cipher: '31759', solution: '13579', type: 'swap' },
    // E12: replace SPECTRUM(reverse) -> numeric reverse
    { id: 'E12', cipher: '93175', solution: '57139', type: 'reverse' },
    // E15: replace COSMIC(swap) -> numeric swap
    // swap('271828'): 2<->7, 1<->8, 2<->8 => '728182'
    { id: 'E15', cipher: '728182', solution: '271828', type: 'swap' },
    // E17: replace BEACON(reverse) -> numeric shift
    // encode 9021 with shift+2: 9->1, 0->2, 2->4, 1->3 => '1243'
    { id: 'E17', cipher: '1243', solution: '9021', type: 'shift', shift: 2 },
    // E23: replace AURORA(reverse) -> numeric noise
    { id: 'E23', cipher: '8#6$4%2^0', solution: '86420', type: 'noise' },
];

let errors = 0;
newNumericQuestions.forEach(q => {
    let decoded = '';
    if (q.type === 'shift') decoded = tools.shift(q.cipher, q.shift);
    else if (q.type === 'reverse') decoded = tools.reverse(q.cipher);
    else if (q.type === 'noise') decoded = tools.noise(q.cipher);
    else if (q.type === 'swap') decoded = tools.swap(q.cipher);

    if (decoded !== q.solution) {
        console.error(`MISMATCH ${q.id}: cipher='${q.cipher}' decoded='${decoded}' expected='${q.solution}'`);
        errors++;
    } else {
        console.log(`OK ${q.id}: '${q.cipher}' -> '${decoded}' (${q.type})`);
    }
});

if (errors === 0) console.log('\nAll 6 new numeric questions verified perfectly!');
else console.error(`\n${errors} errors found!`);
