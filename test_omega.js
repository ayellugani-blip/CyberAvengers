const tools = {
    shift: (text, amount = 1) => {
        return text.replace(/[a-zA-Z0-9]/g, c => {
            if (c >= '0' && c <= '9') {
                const d = parseInt(c, 10);
                return String((d - amount + 10) % 10);
            }
            const base = c <= 'Z' ? 65 : 97;
            return String.fromCharCode(((c.charCodeAt(0) - base - amount + 26) % 26) + base);
        });
    },
    reverse: text => text.split('').reverse().join(''),
    number: text => {
        try {
            return text.trim().split(/\s+/).map(numStr => {
                const n = parseInt(numStr, 10);
                if (isNaN(n) || n < 1 || n > 26) return numStr;
                return String.fromCharCode(64 + n);
            }).join('');
        } catch (e) { return text; }
    },
    noise: text => text.replace(/[^a-zA-Z0-9\s]/g, ''),
    swap: text => {
        const arr = text.split('');
        for (let i = 0; i < arr.length - 1; i += 2) {
            const temp = arr[i];
            arr[i] = arr[i + 1];
            arr[i + 1] = temp;
        }
        return arr.join('');
    }
};

function encodeShift(solution, shift) {
    return solution.replace(/[a-zA-Z0-9]/g, c => {
        if (c >= '0' && c <= '9') {
            const d = parseInt(c, 10);
            return String((d + shift) % 10);
        }
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + shift) % 26) + base);
    });
}

function encodeNumber(solution) {
    return solution.toUpperCase().split('').map(c => {
        const code = c.charCodeAt(0) - 64;
        return (code >= 1 && code <= 26) ? code : c;
    }).join(' ');
}

function encodeSwap(solution) {
    const arr = solution.split('');
    for (let i = 0; i < arr.length - 1; i += 2) {
        const temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
    }
    return arr.join('');
}

const omegaMissions = [
    { id: 'H1', name: 'OMEGA SHIFT 1', cipher: encodeShift('CHRONOSPHERE', 7), solution: 'CHRONOSPHERE', type: 'shift', shift: 7, hint: 'Temporal grid shifted by 7 alpha positions.' },
    { id: 'H2', name: 'OMEGA REVERSE 1', cipher: tools.reverse('ASTROPHYSICS'), solution: 'ASTROPHYSICS', type: 'reverse', hint: 'Cosmic telemetry stream inverted backwards.' },
    { id: 'H3', name: 'OMEGA NUMBER 1', cipher: encodeNumber('NANOTECHNOLOGY'), solution: 'NANOTECHNOLOGY', type: 'number', hint: 'Complex 14-element positional coordinate key for nanites.' },
    { id: 'H4', name: 'OMEGA NOISE 1', cipher: '!#M$%U^&L*(T)_+I{|V}:"E<>?R~`S!@E', solution: 'MULTIVERSE', type: 'noise', hint: 'Dense multi-tier noise cluster obscuring timeline core.' },
    { id: 'H5', name: 'OMEGA SWAP 1', cipher: encodeSwap('VIBRANIUMCORE'), solution: 'VIBRANIUMCORE', type: 'swap', hint: 'Wakandan metal core transposed in adjacent character pairs.' },
    { id: 'H6', name: 'OMEGA SHIFT 2', cipher: encodeShift('TELEPORTATION', 8), solution: 'TELEPORTATION', type: 'shift', shift: 8, hint: 'Quantum leap offset forward by 8 alphabet positions.' },
    { id: 'H7', name: 'OMEGA REVERSE 2', cipher: tools.reverse('EXTRADIMENSIONAL'), solution: 'EXTRADIMENSIONAL', type: 'reverse', hint: 'Inter-realm vector sequence inverted from end to end.' },
    { id: 'H8', name: 'OMEGA NUMBER 2', cipher: encodeNumber('SINGULARITY'), solution: 'SINGULARITY', type: 'number', hint: 'Black hole event horizon encoded into 11-digit coordinate array.' },
    { id: 'H9', name: 'OMEGA NOISE 2', cipher: '@#A$%N^&T*(I)_+M{|}A:"T<>?T~`E!@R', solution: 'ANTIMATTER', type: 'noise', hint: 'Heavy sub-atomic particle noise shielding dark energy.' },
    { id: 'H10', name: 'OMEGA SWAP 2', cipher: encodeSwap('THERMONUCLEAR'), solution: 'THERMONUCLEAR', type: 'swap', hint: 'Sub-atomic nuclear payload pair-swapped.' },
    { id: 'H11', name: 'OMEGA SHIFT 3', cipher: encodeShift('NEUROTRANSMITTER', 5), solution: 'NEUROTRANSMITTER', type: 'shift', shift: 5, hint: 'Neural pathway signal shifted by 5 units.' },
    { id: 'H12', name: 'OMEGA REVERSE 3', cipher: tools.reverse('ELECTROMAGNETIC'), solution: 'ELECTROMAGNETIC', type: 'reverse', hint: 'Emp pulse signal inverted across main conduit.' },
    { id: 'H13', name: 'OMEGA NUMBER 3', cipher: encodeNumber('BIOCHEMISTRY'), solution: 'BIOCHEMISTRY', type: 'number', hint: 'Serum formula encoded in sequential positional numbers.' },
    { id: 'H14', name: 'OMEGA NOISE 3', cipher: '$%S^&U*()P_+=E~`R!@P#$O%^S&*(I)_+T{|I}:"O<>?N', solution: 'SUPERPOSITION', type: 'noise', hint: 'Quantum superposition state obscured by multi-layered static.' },
    { id: 'H15', name: 'OMEGA SWAP 3', cipher: encodeSwap('CRYPTOANALYSIS'), solution: 'CRYPTOANALYSIS', type: 'swap', hint: 'Decryption analysis matrix scrambled in pairwise blocks.' },
    { id: 'H16', name: 'OMEGA SHIFT 4', cipher: encodeShift('HYPERSPACE', 9), solution: 'HYPERSPACE', type: 'shift', shift: 9, hint: 'Hyperspace jump coordinates offset by 9 alphabet steps.' },
    { id: 'H17', name: 'OMEGA REVERSE 4', cipher: tools.reverse('KINETICENERGY'), solution: 'KINETICENERGY', type: 'reverse', hint: 'Absorbed kinetic energy vector reversed.' },
    { id: 'H18', name: 'OMEGA NUMBER 4', cipher: encodeNumber('ASTROPHYSICAL'), solution: 'ASTROPHYSICAL', type: 'number', hint: 'Celestial beacon coordinates mapped to 1-26 index.' },
    { id: 'H19', name: 'OMEGA NOISE 4', cipher: '!@H#$E%^L&*(I)_+O~`S!@U#$S%^P&*(E)_+N{|}S:"I<>?O~`N', solution: 'HELIOSUSPENSION', type: 'noise', hint: 'Solar reactor suspension protocol surrounded by corrupted stream.' },
    { id: 'H20', name: 'OMEGA SWAP 4', cipher: encodeSwap('INTERSTELLAR'), solution: 'INTERSTELLAR', type: 'swap', hint: 'Interstellar flight registry pair-permuted.' },
    { id: 'H21', name: 'OMEGA SHIFT 5', cipher: encodeShift('9876543210', 6), solution: '9876543210', type: 'shift', shift: 6, hint: 'Numeric grid countdown offset forward by +6 steps.' },
    { id: 'H22', name: 'OMEGA REVERSE 5', cipher: tools.reverse('445566778899'), solution: '445566778899', type: 'reverse', hint: 'Core numeric sequence flow inverted.' },
    { id: 'H23', name: 'OMEGA NUMBER 5', cipher: encodeNumber('SORCERERSUPREME'), solution: 'SORCERERSUPREME', type: 'number', hint: 'Master of Mystic Arts security code in 1-26 positions.' },
    { id: 'H24', name: 'OMEGA NOISE 5', cipher: '!#S$%T^&O*(R)_+M{|}S:"T<>?R~`Y!@K#$E%^R', solution: 'STORMSTRYKER', type: 'noise', hint: 'Heavy weather defense payload masked by multi-symbol static.' },
    { id: 'H25', name: 'OMEGA SWAP 5', cipher: encodeSwap('GALACTICCONSUMER'), solution: 'GALACTICCONSUMER', type: 'swap', hint: 'Cosmic devouring protocol pair-permuted.' }
];

let errors = 0;
omegaMissions.forEach(m => {
    let res = '';
    if (m.type === 'shift') res = tools.shift(m.cipher, m.shift || 1);
    else if (m.type === 'reverse') res = tools.reverse(m.cipher);
    else if (m.type === 'number') res = tools.number(m.cipher);
    else if (m.type === 'noise') res = tools.noise(m.cipher);
    else if (m.type === 'swap') res = tools.swap(m.cipher);

    if (res.toLowerCase() !== m.solution.toLowerCase()) {
        console.error(`MISMATCH in ${m.id} (${m.name}): cipher='${m.cipher}' => computed '${res}' vs expected '${m.solution}'`);
        errors++;
    }
});
if (errors === 0) {
    console.log('SUCCESS: All 25 new OMEGA MISSIONS tested 100% PERFECTLY!');
} else {
    console.error(`FAILURE: ${errors} errors found in OMEGA MISSIONS`);
}
