const tools = {
    shift: (text, amount = 1) => text.replace(/[a-zA-Z0-9]/g, c => {
        if (c >= '0' && c <= '9') return String((parseInt(c, 10) - amount + 10) % 10);
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base - amount + 26) % 26) + base);
    }),
    reverse: text => text.split('').reverse().join(''),
    number: text => text.trim().split(/\s+/).map(n => String.fromCharCode(64 + parseInt(n, 10))).join(''),
    noise: text => text.replace(/[^a-zA-Z0-9\s]/g, ''),
    swap: text => {
        const arr = text.split('');
        for (let i = 0; i < arr.length - 1; i += 2) {
            const temp = arr[i]; arr[i] = arr[i+1]; arr[i+1] = temp;
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

const rawMissions = [
    { id: 'M1', name: 'TACTICAL REVERSE', solution: 'OVERWATCH', type: 'reverse', hint: 'Tactical surveillance beacon reversed.' },
    { id: 'M2', name: 'ALPHA DISPLACEMENT OPERATIVE', solution: 'INFILTRATOR', type: 'shift', shift: 4, hint: 'Infiltration unit callsign shifted +4 steps.' },
    { id: 'M3', name: 'NUMERIC SYSTEM PROTOCOL', solution: 'PROTOCOL', type: 'number', hint: 'Security protocol numerical coordinates.' },
    { id: 'M4', name: 'NOISE MATRIX CYBER', solution: 'CYBERSPACE', type: 'noise', noiseMask: 'C#$Y%B^E&R!@S#$P%^A&*(C)_+E', hint: 'Scrambled static overlay shielding digital grid.' },
    { id: 'M5', name: 'SWAP OPERATIVE HERO', solution: 'BLACKPANTHER', type: 'swap', hint: 'Wakandan king identity pair-permuted.' },
    { id: 'M6', name: 'MYTHIC SHIFT GRID', solution: 'EXCALIBUR', type: 'shift', shift: 5, hint: 'Mythic defense grid offset by 5 positions.' },
    { id: 'M7', name: 'COMMAND REVERSE OVERRIDE', solution: 'DOMINATOR', type: 'reverse', hint: 'Inverted command node vector.' },
    { id: 'M8', name: 'LABYRINTH NUMERIC CORE', solution: 'LABYRINTH', type: 'number', hint: 'Positional index for sub-level maze core.' },
    { id: 'M9', name: 'COMMANDER NOISE SIGNAL', solution: 'STARLORD', type: 'noise', noiseMask: 'S!@T#$A%^R&*(L!@O#$R%^D', hint: 'Guardians commander signal masked by static.' },
    { id: 'M10', name: 'TACTICAL SWAP PLAN', solution: 'STRATAGEM', type: 'swap', hint: 'Battle plan registry pairwise swapped.' },
    { id: 'M11', name: 'SUBSEA SHIFT OPERATIVE', solution: 'LEVIATHAN', type: 'shift', shift: 3, hint: 'Sub-sea anomaly grid shifted forward by 3.' },
    { id: 'M12', name: 'NETWORK STREAM REVERSE', solution: 'CYBERGRID', type: 'reverse', hint: 'Digital network stream inverted.' },
    { id: 'M13', name: 'RANK NUMERIC OPERATIVE', solution: 'CENTURION', type: 'number', hint: 'Nova Corps rank encoded in positional numbers.' },
    { id: 'M14', name: 'ROGUE BASE NOISE', solution: 'HYDRABASE', type: 'noise', noiseMask: 'H!@Y#$D%^R&*(A!@B#$A%^S&*(E', hint: 'Rogue installation channel flooded with symbols.' },
    { id: 'M15', name: 'ARMORED SWAP UNIT', solution: 'WARMACHINE', type: 'swap', hint: 'Armored response unit callsign transposed.' },
    { id: 'M16', name: 'TELEPORT SHIFT OPERATIVE', solution: 'NIGHTCRAWLER', type: 'shift', shift: 4, hint: 'Teleportation mutant key shifted by +4.' },
    { id: 'M17', name: 'EVENT HORIZON REVERSE', solution: 'CATACLYSM', type: 'reverse', hint: 'Global event horizon string reversed.' },
    { id: 'M18', name: 'SPECTRUM NUMERIC ARRAY', solution: 'QUICKSILVER', type: 'number', hint: 'High-speed operative numeric array.' },
    { id: 'M19', name: 'AVENGER NOISE FREQUENCY', solution: 'WONDERMAN', type: 'noise', noiseMask: 'W!@O#$N%^D&*(E!@R#$M%^A&*(N', hint: 'Avenger frequency corrupted by cosmic noise.' },
    { id: 'M20', name: 'STRIKE SQUAD SWAP', solution: 'THUNDERBOLT', type: 'swap', hint: 'Tactical strike squad name permuted in pairs.' },
    { id: 'M21', name: 'AUTHORITY NUMERIC KEY', solution: 'OMNIPOTENT', type: 'number', hint: 'Cosmic authority key in 1-26 alphabet values.' },
    { id: 'M22', name: 'COUNTDOWN DIGIT REVERSE', solution: '765432109', type: 'reverse', hint: 'Operative level numeric stream inverted.' },
    { id: 'M23', name: 'HERO BADGE NUMERIC', solution: 'DAREDEVIL', type: 'number', hint: 'Hell\'s Kitchen hero badge in positional index.' },
    { id: 'M24', name: 'OPERATIVE DIGIT SHIFT', solution: '6789012', type: 'shift', shift: 3, hint: 'Operative digit cipher shifted by +3 vector.' },
    { id: 'M25', name: 'MARKSMAN SHIFT CALLSIGN', solution: 'HAWKEYE', type: 'shift', shift: 5, hint: 'Marksman operative callsign offset by +5.' }
];

const operativeMissions = rawMissions.map(m => {
    let cipher = '';
    if (m.type === 'shift') cipher = encodeShift(m.solution, m.shift);
    else if (m.type === 'reverse') cipher = tools.reverse(m.solution);
    else if (m.type === 'number') cipher = encodeNumber(m.solution);
    else if (m.type === 'noise') cipher = m.noiseMask;
    else if (m.type === 'swap') cipher = encodeSwap(m.solution);

    const obj = { id: m.id, name: m.name, cipher, solution: m.solution, type: m.type };
    if (m.shift) obj.shift = m.shift;
    obj.hint = m.hint;
    return obj;
});

console.log(JSON.stringify(operativeMissions, null, 4));

// Test verification
let err = 0;
operativeMissions.forEach(m => {
    let res = '';
    if (m.type === 'shift') res = tools.shift(m.cipher, m.shift);
    else if (m.type === 'reverse') res = tools.reverse(m.cipher);
    else if (m.type === 'number') res = tools.number(m.cipher);
    else if (m.type === 'noise') res = tools.noise(m.cipher);
    else if (m.type === 'swap') res = tools.swap(m.cipher);

    if (res !== m.solution) {
        console.error(`MISMATCH: ${m.id} ${m.solution} => decoded '${res}'`);
        err++;
    }
});

if (err === 0) console.log("ALL 25 OPERATIVE MISSIONS ENCODED PERFECTLY!");
