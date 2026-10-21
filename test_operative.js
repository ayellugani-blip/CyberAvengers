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

const initiateMissions = [
    { id: 'E1', name: 'ALPHABET DISPLACEMENT', cipher: encodeShift('CYBER', 3), solution: 'CYBER', type: 'shift', shift: 3, hint: 'Data stream offset by 3 positions forward in the alphabet.' },
    { id: 'E2', name: 'REVERSED MATRIX', cipher: 'XIRTAM', solution: 'MATRIX', type: 'reverse', hint: 'Core signal direction vector is completely inverted.' },
    { id: 'E3', name: 'COORDINATE OVERRIDE', cipher: '6 9 18 5 23 1 12 12', solution: 'FIREWALL', type: 'number', hint: 'Integers represent 1-26 positional index of defense system.' },
    { id: 'E4', name: 'NOISE ISOLATION', cipher: 'P#H#A#N#T#O#M', solution: 'PHANTOM', type: 'noise', hint: 'Filter out inline hash symbols masking stealth identity.' },
    { id: 'E5', name: 'PAIR PERMUTATION', cipher: 'ESTNNILE', solution: 'SENTINEL', type: 'swap', hint: 'Consecutive letter pairs have been swapped in transmission.' },
    { id: 'E6', name: 'NUMERIC OFFSET', cipher: encodeShift('3456', 2), solution: '3456', type: 'shift', shift: 2, hint: 'Numerical stream shifted forward by 2 digits.' },
    { id: 'E7', name: 'MIRROR VECTOR', cipher: 'XETROV', solution: 'VORTEX', type: 'reverse', hint: 'Read backwards from right to left to stabilize the portal.' },
    { id: 'E8', name: 'INDEX CIPHER', cipher: '20 5 13 16 5 19 20', solution: 'TEMPEST', type: 'number', hint: 'Sequence maps directly to alphabet positions (1=A, 20=T).' },
    { id: 'E9', name: 'DELIMITER PURGE', cipher: 'V@I@B@R@A@N@I@U@M', solution: 'VIBRANIUM', type: 'noise', hint: 'Remove inline delimiter artifacts (@) to reveal element.' },
    { id: 'E10', name: 'FLIPPED PAIRS', cipher: 'ITATN', solution: 'TITAN', type: 'swap', hint: 'Adjacent characters transposed in satellite log.' },
    { id: 'E11', name: 'TRIPLE SHIFT', cipher: encodeShift('VALKYRIE', 3), solution: 'VALKYRIE', type: 'shift', shift: 3, hint: 'Letters advanced by 3 steps; roll back to identify warrior.' },
    { id: 'E12', name: 'REVERSED SIGNAL', cipher: 'MURTCEPS', solution: 'SPECTRUM', type: 'reverse', hint: 'Optical reversal detected in spatial grid.' },
    { id: 'E13', name: 'NUMERIC GRID', cipher: '8 25 4 18 1', solution: 'HYDRA', type: 'number', hint: 'Encrypted numeric coordinates map to rogue organization.' },
    { id: 'E14', name: 'STATIC STRIPPER', cipher: 'I*N*F*I*N*I*T*Y', solution: 'INFINITY', type: 'noise', hint: 'Strip wildcard noise stars inserted across core.' },
    { id: 'E15', name: 'HEADER SWAP', cipher: 'OCMSCI', solution: 'COSMIC', type: 'swap', hint: 'Transposition error: pairwise character swap detected.' },
    { id: 'E16', name: 'ADVANCED ROTATION', cipher: encodeShift('CAESAR', 4), solution: 'CAESAR', type: 'shift', shift: 4, hint: 'Classical cipher algorithm shifted by 4 positions.' },
    { id: 'E17', name: 'REVERSED COMMAND', cipher: 'NOCAEB', solution: 'BEACON', type: 'reverse', hint: 'Transmission flow inverted from end to beginning.' },
    { id: 'E18', name: 'ALPHA DECODER', cipher: '2 1 19 20 9 15 14', solution: 'BASTION', type: 'number', hint: 'Standard 1-26 numeric index key for defensive node.' },
    { id: 'E19', name: 'CLEAN SIGNAL', cipher: 'E%C%L%I%P%S%E', solution: 'ECLIPSE', type: 'noise', hint: 'Purge percent symbols masking planetary alignment.' },
    { id: 'E20', name: 'BLOCK TRANSPOSITION', cipher: 'EHILACRREIR', solution: 'HELICARRIER', type: 'swap', hint: 'Helicarrier tactical registry has pairwise swapped letters.' },
    { id: 'E21', name: 'QUAD SHIFT', cipher: encodeShift('STRIKER', 4), solution: 'STRIKER', type: 'shift', shift: 4, hint: 'Uniform 4-letter offset progression in attack vector.' },
    { id: 'E22', name: 'NUMERIC CODE ZERO', cipher: '26 5 18 15', solution: 'ZERO', type: 'number', hint: 'Alphanumeric positions for terminal countdown.' },
    { id: 'E23', name: 'REVERSED SKY', cipher: 'ARORUA', solution: 'AURORA', type: 'reverse', hint: 'Inverted atmospheric energy signature.' },
    { id: 'E24', name: 'SYMBOL REMOVAL', cipher: 'J!A!R!V!I!S', solution: 'JARVIS', type: 'noise', hint: 'Filter out exclamation marks from AI protocol stream.' },
    { id: 'E25', name: 'FINAL SHIFT INITIATE', cipher: encodeShift('VISION', 3), solution: 'VISION', type: 'shift', shift: 3, hint: 'Shift back 3 letters to reveal synthezoid identity.' }
];

const operativeMissions = [
    { id: 'M1', name: 'OPERATIVE REVERSE 1', cipher: tools.reverse('OVERWATCH'), solution: 'OVERWATCH', type: 'reverse', hint: 'Tactical surveillance beacon reversed.' },
    { id: 'M2', name: 'OPERATIVE SHIFT 1', cipher: encodeShift('INFILTRATOR', 4), solution: 'INFILTRATOR', type: 'shift', shift: 4, hint: 'Infiltration unit callsign shifted +4 steps.' },
    { id: 'M3', name: 'OPERATIVE NUMBER 1', cipher: encodeNumber('PROTOCOL'), solution: 'PROTOCOL', type: 'number', hint: 'Security protocol numerical coordinates.' },
    { id: 'M4', name: 'OPERATIVE NOISE 1', cipher: 'C#$Y%B^E&R*S(P)A_C+E', solution: 'CYBERSPACE', type: 'noise', hint: 'Scrambled static overlay shielding digital grid.' },
    { id: 'M5', name: 'OPERATIVE SWAP 1', cipher: encodeSwap('BLACKPANTHER'), solution: 'BLACKPANTHER', type: 'swap', hint: 'Wakandan king identity pair-permuted.' },
    { id: 'M6', name: 'OPERATIVE SHIFT 2', cipher: encodeShift('EXCALIBUR', 5), solution: 'EXCALIBUR', type: 'shift', shift: 5, hint: 'Mythic defense grid offset by 5 positions.' },
    { id: 'M7', name: 'OPERATIVE REVERSE 2', cipher: tools.reverse('DOMINATOR'), solution: 'DOMINATOR', type: 'reverse', hint: 'Inverted command node vector.' },
    { id: 'M8', name: 'OPERATIVE NUMBER 2', cipher: encodeNumber('LABYRINTH'), solution: 'LABYRINTH', type: 'number', hint: 'Positional index for sub-level maze core.' },
    { id: 'M9', name: 'OPERATIVE NOISE 2', cipher: 'S*&T$#A@!R%^L&(O*)R_+$D', solution: 'STARLORD', type: 'noise', hint: 'Guardians commander signal masked by static.' },
    { id: 'M10', name: 'OPERATIVE SWAP 2', cipher: encodeSwap('STRATAGEM'), solution: 'STRATAGEM', type: 'swap', hint: 'Battle plan registry pairwise swapped.' },
    { id: 'M11', name: 'OPERATIVE SHIFT 3', cipher: encodeShift('LEVIATHAN', 3), solution: 'LEVIATHAN', type: 'shift', shift: 3, hint: 'Sub-sea anomaly grid shifted forward by 3.' },
    { id: 'M12', name: 'OPERATIVE REVERSE 3', cipher: tools.reverse('CYBERGRID'), solution: 'CYBERGRID', type: 'reverse', hint: 'Digital network stream inverted.' },
    { id: 'M13', name: 'OPERATIVE NUMBER 3', cipher: encodeNumber('CENTURION'), solution: 'CENTURION', type: 'number', hint: 'Nova Corps rank encoded in positional numbers.' },
    { id: 'M14', name: 'OPERATIVE NOISE 3', cipher: 'H!@Y#$D%^R&*(A!@B#$A%^S&*(E', solution: 'HYDRABASE', type: 'noise', hint: 'Rogue installation channel flooded with symbols.' },
    { id: 'M15', name: 'OPERATIVE SWAP 3', cipher: encodeSwap('WARMACHINE'), solution: 'WARMACHINE', type: 'swap', hint: 'Armored response unit callsign transposed.' },
    { id: 'M16', name: 'OPERATIVE SHIFT 4', cipher: encodeShift('NIGHTCRAWLER', 4), solution: 'NIGHTCRAWLER', type: 'shift', shift: 4, hint: 'Teleportation mutant key shifted by +4.' },
    { id: 'M17', name: 'OPERATIVE REVERSE 4', cipher: tools.reverse('CATACLYSM'), solution: 'CATACLYSM', type: 'reverse', hint: 'Global event horizon string reversed.' },
    { id: 'M18', name: 'OPERATIVE NUMBER 4', cipher: encodeNumber('QUICKSILVER'), solution: 'QUICKSILVER', type: 'number', hint: 'High-speed operative numeric array.' },
    { id: 'M19', name: 'OPERATIVE NOISE 4', cipher: 'W#$O%^N&*(D!@E#$R%^M&*(A!@N', solution: 'WONDERMAN', type: 'noise', hint: 'Avenger frequency corrupted by cosmic noise.' },
    { id: 'M20', name: 'OPERATIVE SWAP 4', cipher: encodeSwap('THUNDERBOLT'), solution: 'THUNDERBOLT', type: 'swap', hint: 'Tactical strike squad name permuted in pairs.' },
    { id: 'M21', name: 'OPERATIVE NUMBER 5', cipher: encodeNumber('OMNIPOTENT'), solution: 'OMNIPOTENT', type: 'number', hint: 'Cosmic authority key in 1-26 alphabet values.' },
    { id: 'M22', name: 'OPERATIVE DIGIT REVERSE', cipher: tools.reverse('765432109'), solution: '765432109', type: 'reverse', hint: 'Operative level numeric stream inverted.' },
    { id: 'M23', name: 'OPERATIVE NUMBER HERO', cipher: encodeNumber('DAREDEVIL'), solution: 'DAREDEVIL', type: 'number', hint: 'Hell\'s Kitchen hero badge in positional index.' },
    { id: 'M24', name: 'OPERATIVE DIGIT SHIFT', cipher: encodeShift('6789012', 3), solution: '6789012', type: 'shift', shift: 3, hint: 'Operative digit cipher shifted by +3 vector.' },
    { id: 'M25', name: 'OPERATIVE SHIFT HERO', cipher: encodeShift('HAWKEYE', 5), solution: 'HAWKEYE', type: 'shift', shift: 5, hint: 'Marksman operative callsign offset by +5.' }
];

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
    { id: 'H22', name: 'OMEGA DIGIT REVERSE', cipher: tools.reverse('998877665544'), solution: '998877665544', type: 'reverse', hint: 'Core numeric sequence flow inverted.' },
    { id: 'H23', name: 'FINAL NUMBER OMEGA', cipher: encodeNumber('SORCERERSUPREME'), solution: 'SORCERERSUPREME', type: 'number', hint: 'Master of Mystic Arts security code in 1-26 positions.' },
    { id: 'H24', name: 'FINAL NOISE OMEGA', cipher: '!#S$%T^&O*(R)_+M{|}S:"T<>?R~`Y!@K#$E%^R', solution: 'STORMSTRYKER', type: 'noise', hint: 'Heavy weather defense payload masked by multi-symbol static.' },
    { id: 'H25', name: 'FINAL SWAP OMEGA', cipher: encodeSwap('GALACTICCONSUMER'), solution: 'GALACTICCONSUMER', type: 'swap', hint: 'Cosmic devouring protocol pair-permuted.' }
];

let totalErrors = 0;
const solutionsSet = new Set();
const allMissions = [...initiateMissions, ...operativeMissions, ...omegaMissions];

console.log(`Testing total ${allMissions.length} missions across 3 levels...`);

allMissions.forEach(m => {
    let res = '';
    if (m.type === 'shift') res = tools.shift(m.cipher, m.shift || 1);
    else if (m.type === 'reverse') res = tools.reverse(m.cipher);
    else if (m.type === 'number') res = tools.number(m.cipher);
    else if (m.type === 'noise') res = tools.noise(m.cipher);
    else if (m.type === 'swap') res = tools.swap(m.cipher);

    if (res.toLowerCase() !== m.solution.toLowerCase()) {
        console.error(`MISMATCH in ${m.id} (${m.name}): cipher='${m.cipher}' => computed '${res}' vs expected '${m.solution}'`);
        totalErrors++;
    }

    const solLower = m.solution.toLowerCase();
    if (solutionsSet.has(solLower)) {
        console.error(`DUPLICATE SOLUTION FOUND: '${m.solution}' in mission ${m.id}`);
        totalErrors++;
    } else {
        solutionsSet.add(solLower);
    }
});

if (totalErrors === 0) {
    console.log(`SUCCESS! All ${allMissions.length} questions across Level 1, Level 2, Level 3 decrypted 100% PERFECTLY and all ${solutionsSet.size} solutions are 100% UNIQUE!`);
} else {
    console.error(`FAILURE: Found ${totalErrors} errors.`);
}
