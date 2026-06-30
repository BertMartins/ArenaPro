Eu quero que meu projeto fique exatamente igual a esse projeto que vou lhe mostrar só que ele está em html tailwind e js eu quero que meu preojeto fique com banco de dados, backend e frontend, adapte com que já tenho substitua o que for precisar para deixar o mais semelhante a esse código html:

<!DOCTYPE html>
<html lang="pt-BR" class="h-full">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VoleiPro - Gestão de Jogos</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Bebas+Neue&display=swap" rel="stylesheet">

    <style>
        :root {
            --primary-orange: #FF6B35;
            --primary-blue: #1E40AF;
            --secondary-yellow: #F59E0B;
            --dark-bg: #0F172A;
            --card-bg: #1E293B;
        }

        * {
            font-family: 'Poppins', sans-serif;
        }

        .title-font {
            font-family: 'Bebas Neue', cursive;
        }

        body {
            background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
            min-height: 100vh;
        }

        /* Animações */
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideIn {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
        }

        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }

        .animate-fadeIn {
            animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideIn {
            animation: slideIn 0.3s ease-out forwards;
        }

        .animate-bounce {
            animation: bounce 2s infinite;
        }

        .animate-pulse {
            animation: pulse 2s infinite;
        }

        /* Gradientes */
        .gradient-orange {
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
        }

        .gradient-blue {
            background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
        }

        .gradient-yellow {
            background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%);
        }

        /* Cards com efeito glass */
        .glass-card {
            background: rgba(30, 41, 59, 0.8);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Botões personalizados */
        .btn-primary {
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(255, 107, 53, 0.3);
        }

        .btn-secondary {
            background: linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%);
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
        }

        /* Input estilizado */
        .custom-input {
            background: rgba(30, 41, 59, 0.6);
            border: 2px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s ease;
        }

        .custom-input:focus {
            border-color: #FF6B35;
            background: rgba(30, 41, 59, 0.8);
            outline: none;
        }

        /* Badge de nível */
        .level-badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-weight: bold;
            font-size: 1.1rem;
        }

        .level-1 { background: linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%); }
        .level-2 { background: linear-gradient(135deg, #22C55E 0%, #4ADE80 100%); }
        .level-3 { background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%); }
        .level-4 { background: linear-gradient(135deg, #A855F7 0%, #C084FC 100%); }
        .level-5 { background: linear-gradient(135deg, #F59E0B 0%, #FCD34D 100%); }
        .level-6 { background: linear-gradient(135deg, #EF4444 0%, #F87171 100%); }

        /* Placar */
        .score-display {
            font-size: 4rem;
            font-weight: 800;
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        /* Loading */
        .loader {
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top: 4px solid #FF6B35;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Responsivo */
        @media (max-width: 640px) {
            .score-display {
                font-size: 3rem;
            }
        }

        /* Esconder scrollbar mas manter funcionalidade */
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        /* Radio button customizado para níveis */
        input[type="radio"]:checked + .level-badge {
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.5);
        }

        /* Botão de ajuda flutuante */
        .help-button {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
            box-shadow: 0 4px 20px rgba(255, 107, 53, 0.4);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 40;
        }

        .help-button:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 30px rgba(255, 107, 53, 0.6);
        }

        .help-button:active {
            transform: scale(0.95);
        }

        @keyframes shake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
        }

        .help-button.animate-shake {
            animation: shake 0.5s ease-in-out;
        }
    </style>
</head>
<body class="h-full">
    <div id="app" class="h-full"></div>

    <script>
        // ============================================
        // SISTEMA DE DADOS (Mockado em memória)
        // ============================================
        const AppState = {
            currentUser: null,
            currentView: 'login',
            users: [
                { id: 1, name: 'Heberte', email: 'heberte@email.com', password: '123', role: 'admin', level: 5, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 2, name: 'Bea', email: 'bea@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 3, name: 'Gustavo R.', email: 'gustavo.r@email.com', password: '123', role: 'player', level: 6, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 4, name: 'Diogo', email: 'diogo@email.com', password: '123', role: 'player', level: 6, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 5, name: 'Lowren', email: 'lowren@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 6, name: 'Kevin', email: 'kevin@email.com', password: '123', role: 'player', level: 6, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 7, name: 'Júlia', email: 'julia@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 8, name: 'Luan', email: 'luan@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 9, name: 'Mayara', email: 'mayara@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 10, name: 'Rodrigues', email: 'rodrigues@email.com', password: '123', role: 'player', level: 5, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 11, name: 'Renata', email: 'renata@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 12, name: 'Sarah', email: 'sarah@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 13, name: 'Bruna', email: 'bruna@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 14, name: 'Lucas', email: 'lucas@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 15, name: 'Dourivan ', email: 'Dourivan@email.com', password: '123', role: 'player', level: 6, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} },
                { id: 16, name: 'Cleverton ', email: 'Cleverton@email.com', password: '123', role: 'player', level: 3, photo: '🏐', paymentType: 'monthly', stats: { wins: 0, losses: 0, championships: 0 }, monthlyPayments: {} }
            ],
            games: [
                {
                    id: 1,
                    date: '2024-12-04',
                    status: 'open',
                    players: [
                        { userId: 1, timestamp: Date.now() - 12000000, paymentType: 'monthly' }, 
                        { userId: 2, timestamp: Date.now() - 11000000, paymentType: 'monthly' },  
                        { userId: 3, timestamp: Date.now() - 10000000, paymentType: 'monthly' },    
                        { userId: 4, timestamp: Date.now() - 9000000, paymentType: 'monthly' },   
                        { userId: 5, timestamp: Date.now() - 8000000, paymentType: 'monthly' },   
                        { userId: 6, timestamp: Date.now() - 7000000, paymentType: 'monthly' },     
                        { userId: 7, timestamp: Date.now() - 6000000, paymentType: 'monthly' },   
                        { userId: 8, timestamp: Date.now() - 5000000, paymentType: 'monthly' },   
                        { userId: 9, timestamp: Date.now() - 4000000, paymentType: 'monthly' },   
                        { userId: 10, timestamp: Date.now() - 3000000, paymentType: 'monthly' },  
                        { userId: 11, timestamp: Date.now() - 2000000, paymentType: 'monthly' }, 
                        { userId: 12, timestamp: Date.now() - 1000000, paymentType: 'monthly' },    
                        { userId: 13, timestamp: Date.now() - 1000000, paymentType: 'monthly' }
                    ],
                    maxPlayers: 16,
                    adminId: 1,
                    teamSize: 4,
                    twoWinsRule: true,
                    pointsPerMatch: 10,
                    matchHistory: [],
                    cutoffTime: '15:00'
                }
            ],
            currentGame: null,
            currentMatch: null,
            activeMatch: null,
            teams: [],
            matchHistory: [],
            monthlyFees: {}, // { '2025-01': 600, '2025-02': 600 }
            financialControl: {} // { '2024-12': { arenaPaid: 0, dailyBox: 0, dailyPlayers: [] } }
        };

        // ============================================
        // FUNÇÕES DE COOKIES
        // ============================================
        function setCookie(name, value, days = 7) {
            const expires = new Date();
            expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
            document.cookie = `${name}=${encodeURIComponent(JSON.stringify(value))};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
        }

        function getCookie(name) {
            const nameEQ = name + "=";
            const ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) {
                    try {
                        return JSON.parse(decodeURIComponent(c.substring(nameEQ.length, c.length)));
                    } catch (e) {
                        return null;
                    }
                }
            }
            return null;
        }

        function deleteCookie(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        }

        function saveState() {
            setCookie('voleiProUser', AppState.currentUser);
            setCookie('voleiProUsers', AppState.users);
            setCookie('voleiProGames', AppState.games);
            setCookie('voleiProActiveMatch', AppState.activeMatch);
            setCookie('voleiProTeams', AppState.teams);
            setCookie('voleiProCurrentGame', AppState.currentGame);
            setCookie('voleiProMatchHistory', AppState.matchHistory);
            setCookie('voleiProMonthlyFees', AppState.monthlyFees);
            setCookie('voleiProFinancialControl', AppState.financialControl);
        }

        function loadState() {
            const user = getCookie('voleiProUser');
            const users = getCookie('voleiProUsers');
            const games = getCookie('voleiProGames');
            const activeMatch = getCookie('voleiProActiveMatch');
            const teams = getCookie('voleiProTeams');
            const currentGame = getCookie('voleiProCurrentGame');
            const matchHistory = getCookie('voleiProMatchHistory');
            const monthlyFees = getCookie('voleiProMonthlyFees');
            const financialControl = getCookie('voleiProFinancialControl');

            if (user) {
                // Migração do usuário atual
                if (!user.paymentType) user.paymentType = 'monthly';
                if (!user.monthlyPayments) user.monthlyPayments = {};
                AppState.currentUser = user;
            }
            if (users && users.length > 0) {
                // Migração: garantir que todos os usuários tenham os novos campos
                AppState.users = users.map(u => {
                    if (!u.paymentType) u.paymentType = 'monthly';
                    if (!u.monthlyPayments) u.monthlyPayments = {};
                    return u;
                });
            }
            if (games && games.length > 0) AppState.games = games;
            if (activeMatch) AppState.activeMatch = activeMatch;
            if (teams && teams.length > 0) AppState.teams = teams;
            if (currentGame) AppState.currentGame = currentGame;
            if (matchHistory && matchHistory.length > 0) AppState.matchHistory = matchHistory;
            if (monthlyFees) AppState.monthlyFees = monthlyFees;
            if (financialControl) AppState.financialControl = financialControl;

            // Auto-limpar visitantes expirados
            autoCleanupExpiredVisitors();
        }

        // ============================================
        // FUNÇÕES DE LIMPEZA DE VISITANTES
        // ============================================
        function autoCleanupExpiredVisitors() {
            const now = new Date();
            const oneDayInMs = 24 * 60 * 60 * 1000;

            // Encontrar IDs de visitantes que participaram de jogos
            const visitorIds = AppState.users
                .filter(u => u.role === 'visitor')
                .map(u => u.id);

            if (visitorIds.length === 0) return;

            // Para cada visitante, verificar se há jogos em que participou
            const visitorsToDelete = [];

            visitorIds.forEach(visitorId => {
                // Encontrar todos os jogos que o visitante participou
                const gamesWithVisitor = AppState.games.filter(game => {
                    return game.players.some(p => {
                        const userId = typeof p === 'object' ? p.userId : p;
                        return userId === visitorId;
                    });
                });

                // Se não participou de nenhum jogo, não deletar
                if (gamesWithVisitor.length === 0) return;

                // Verificar se todos os jogos já passaram há mais de 1 dia
                const allGamesExpired = gamesWithVisitor.every(game => {
                    const gameDate = new Date(game.date);
                    const dayAfterGame = gameDate.getTime() + oneDayInMs;
                    return now.getTime() > dayAfterGame;
                });

                if (allGamesExpired) {
                    visitorsToDelete.push(visitorId);
                }
            });

            // Deletar visitantes expirados
            if (visitorsToDelete.length > 0) {
                AppState.users = AppState.users.filter(u => !visitorsToDelete.includes(u.id));
                saveState();
            }
        }

        function manualCleanupAllVisitors() {
            const visitorCount = AppState.users.filter(u => u.role === 'visitor').length;

            if (visitorCount === 0) {
                showCustomAlert('Nenhum visitante encontrado para limpar.');
                return;
            }

            showCustomConfirm(
                `Tem certeza que deseja excluir ${visitorCount} visitante${visitorCount > 1 ? 's' : ''}? Esta ação não pode ser desfeita.`,
                () => {
                    // Remover todos os visitantes
                    AppState.users = AppState.users.filter(u => u.role !== 'visitor');

                    // Remover visitantes de todos os jogos
                    AppState.games.forEach(game => {
                        const originalLength = game.players.length;
                        game.players = game.players.filter(p => {
                            const userId = typeof p === 'object' ? p.userId : p;
                            const user = AppState.users.find(u => u.id === userId);
                            return user !== undefined;
                        });
                    });

                    saveState();
                    showCustomAlert(`${visitorCount} visitante${visitorCount > 1 ? 's foram excluídos' : ' foi excluído'} com sucesso!`);
                    render();
                }
            );
        }

        // ============================================
        // FUNÇÕES DE DIÁLOGOS CUSTOMIZADOS
        // ============================================
        function showCustomAlert(message) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn';
            modal.innerHTML = `
                <div class="glass-card rounded-2xl p-6 max-w-sm w-full mx-4 border-2 border-orange-500">
                    <div class="text-center mb-4">
                        <i class="fas fa-info-circle text-orange-400 text-4xl mb-3"></i>
                        <p class="text-white text-lg">${message}</p>
                    </div>
                    <button onclick="this.closest('.fixed').remove()"
                        class="btn-primary w-full py-3 rounded-lg text-white font-bold">
                        <i class="fas fa-check mr-2"></i>OK
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function showCustomConfirm(message, onConfirm) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn';
            modal.innerHTML = `
                <div class="glass-card rounded-2xl p-6 max-w-sm w-full mx-4 border-2 border-orange-500">
                    <div class="text-center mb-4">
                        <i class="fas fa-exclamation-triangle text-yellow-400 text-4xl mb-3"></i>
                        <p class="text-white text-lg">${message}</p>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="this.closest('.fixed').remove()"
                            class="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg text-white font-bold">
                            <i class="fas fa-times mr-2"></i>Cancelar
                        </button>
                        <button onclick="this.closest('.fixed').remove(); (${onConfirm})()"
                            class="flex-1 btn-primary py-3 rounded-lg text-white font-bold">
                            <i class="fas fa-check mr-2"></i>Confirmar
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Store the callback function in a global variable so it can be called
            window._confirmCallback = onConfirm;
            const confirmBtn = modal.querySelector('.btn-primary');
            confirmBtn.onclick = function() {
                modal.remove();
                if (window._confirmCallback) {
                    window._confirmCallback();
                    window._confirmCallback = null;
                }
            };
        }

        // ============================================
        // FUNÇÕES DE AUTENTICAÇÃO
        // ============================================
        function login(email, password) {
            const user = AppState.users.find(u => u.email === email && u.password === password);
            if (user) {
                AppState.currentUser = user;
                saveState();
                navigateTo('dashboard');
                return true;
            }
            return false;
        }

        function logout() {
            AppState.currentUser = null;
            deleteCookie('voleiProUser');
            deleteCookie('voleiProUsers');
            deleteCookie('voleiProGames');
            deleteCookie('voleiProActiveMatch');
            deleteCookie('voleiProTeams');
            deleteCookie('voleiProCurrentGame');
            navigateTo('login');
        }

        function register(name, email, password, paymentType = 'monthly') {
            const newUser = {
                id: AppState.users.length + 1,
                name,
                email,
                password,
                role: 'player',
                level: 3,
                photo: '🏐',
                paymentType: paymentType,
                stats: { wins: 0, losses: 0, championships: 0 },
                monthlyPayments: {}
            };
            AppState.users.push(newUser);
            AppState.currentUser = newUser;
            saveState();
            navigateTo('dashboard');
        }

        // ============================================
        // FUNÇÕES DE JOGOS
        // ============================================
        function createGame(date, maxPlayers = 16, teamSize = 6, twoWinsRule = true, pointsPerMatch = 25, cutoffTime = '15:00') {
            const newGame = {
                id: AppState.games.length + 1,
                date,
                status: 'open',
                players: [], // Será array de objetos: { userId, timestamp, paymentType }
                maxPlayers,
                adminId: AppState.currentUser.id,
                teamSize: parseInt(teamSize),
                twoWinsRule: twoWinsRule,
                pointsPerMatch: parseInt(pointsPerMatch),
                matchHistory: [],
                cutoffTime: cutoffTime
            };
            AppState.games.push(newGame);
            saveState();
            return newGame;
        }

        function joinGame(gameId) {
            const game = AppState.games.find(g => g.id === gameId);
            if (!game || game.status !== 'open') return false;

            // Verificar se já está na lista
            const alreadyJoined = game.players.some(p => (typeof p === 'object' ? p.userId : p) === AppState.currentUser.id);
            if (alreadyJoined) return false;

            // Adicionar jogador com timestamp e tipo de pagamento
            const playerEntry = {
                userId: AppState.currentUser.id,
                timestamp: Date.now(),
                paymentType: AppState.currentUser.paymentType
            };
            game.players.push(playerEntry);

            // Se for diarista ou visitante, adicionar R$ 15 à caixinha
            if (AppState.currentUser.paymentType === 'daily' || AppState.currentUser.role === 'visitor') {
                addToDailyBox(game.date, AppState.currentUser.id, AppState.currentUser.name);
            }

            // Reorganizar lista com prioridade
            reorganizePlayers(game);

            saveState();
            return true;
        }

        function leaveGame(gameId) {
            const game = AppState.games.find(g => g.id === gameId);
            if (game) {
                game.players = game.players.filter(p => {
                    const userId = typeof p === 'object' ? p.userId : p;
                    return userId !== AppState.currentUser.id;
                });

                // Reorganizar lista após saída
                reorganizePlayers(game);

                saveState();
                return true;
            }
            return false;
        }

        // Reorganiza jogadores: mensalistas na lista principal, diaristas como suplentes (antes de 15h)
        function reorganizePlayers(game) {
            if (!game.players || game.players.length === 0) return;

            // Converter players antigos (apenas IDs) para novo formato
            game.players = game.players.map(p => {
                if (typeof p === 'number') {
                    const user = AppState.users.find(u => u.id === p);
                    return {
                        userId: p,
                        timestamp: Date.now(),
                        paymentType: user?.paymentType || 'monthly'
                    };
                }
                return p;
            });

            // Verificar se já passou do horário de corte
            const now = new Date();
            const [cutoffHour, cutoffMinute] = (game.cutoffTime || '15:00').split(':').map(Number);
            const gameDate = new Date(game.date);
            const cutoffDateTime = new Date(gameDate);
            cutoffDateTime.setHours(cutoffHour, cutoffMinute, 0, 0);

            const isPastCutoff = now > cutoffDateTime;

            // Separar mensalistas e diaristas
            const monthlyPlayers = game.players.filter(p => p.paymentType === 'monthly');
            const dailyPlayers = game.players.filter(p => p.paymentType === 'daily');

            // Ordenar ambos por timestamp (ordem de inscrição)
            monthlyPlayers.sort((a, b) => a.timestamp - b.timestamp);
            dailyPlayers.sort((a, b) => a.timestamp - b.timestamp);

            if (isPastCutoff) {
                // APÓS 15h: suplentes diaristas podem preencher vagas
                // Pega mensalistas + diaristas necessários para completar a lista
                const availableSpots = game.maxPlayers;
                let finalList = [...monthlyPlayers];

                // Adiciona diaristas até completar o limite
                const spotsNeeded = availableSpots - finalList.length;
                if (spotsNeeded > 0) {
                    finalList = [...finalList, ...dailyPlayers.slice(0, spotsNeeded)];
                }

                // Resto vai para suplentes
                const remaining = dailyPlayers.slice(spotsNeeded > 0 ? spotsNeeded : 0);
                game.players = [...finalList, ...remaining];
            } else {
                // ANTES de 15h: mensalistas na lista, diaristas como suplentes
                // Mensalistas preenchem a lista principal (até o limite)
                // Diaristas ficam como suplentes (após o limite)
                game.players = [...monthlyPlayers, ...dailyPlayers];
            }
        }

        function addVisitor(gameId, name, level) {
            const visitor = {
                id: Date.now(),
                name,
                level: parseInt(level),
                photo: '👤',
                role: 'visitor',
                paymentType: 'daily', // Visitantes são sempre diaristas
                stats: { wins: 0, losses: 0, championships: 0 },
                monthlyPayments: {}
            };
            AppState.users.push(visitor);

            const game = AppState.games.find(g => g.id === gameId);
            if (game) {
                const playerEntry = {
                    userId: visitor.id,
                    timestamp: Date.now(),
                    paymentType: 'daily'
                };
                game.players.push(playerEntry);
                reorganizePlayers(game);
                saveState();
                return true;
            }
            return false;
        }

        function removePlayerFromGame(gameId, playerId) {
            const game = AppState.games.find(g => g.id === gameId);
            if (game) {
                game.players = game.players.filter(p => {
                    const userId = typeof p === 'object' ? p.userId : p;
                    return userId !== playerId;
                });
                reorganizePlayers(game);
                saveState();
                return true;
            }
            return false;
        }

        // Função auxiliar para obter jogadores de um jogo no novo formato
        function getGamePlayers(game) {
            if (!game || !game.players) return [];

            return game.players.map(p => {
                const userId = typeof p === 'object' ? p.userId : p;
                const user = AppState.users.find(u => u.id === userId);
                if (user) {
                    return {
                        ...user,
                        timestamp: typeof p === 'object' ? p.timestamp : Date.now(),
                        paymentType: typeof p === 'object' ? p.paymentType : (user.paymentType || 'monthly')
                    };
                }
                return null;
            }).filter(Boolean);
        }

        // Separa jogadores entre lista principal e suplentes
        function splitMainAndReserve(game) {
            const allPlayers = getGamePlayers(game);
            const mainPlayers = allPlayers.slice(0, game.maxPlayers);
            const reservePlayers = allPlayers.slice(game.maxPlayers);

            return { mainPlayers, reservePlayers };
        }

        // ============================================
        // FUNÇÕES DE TIMES
        // ============================================
        function createBalancedTeams(playerIds, teamSize = 6) {
            const players = playerIds.map(id => AppState.users.find(u => u.id === id)).filter(Boolean);

            // Calcular número de times baseado no tamanho do time
            const numTeams = Math.floor(players.length / teamSize);

            // Ordenar por nível
            players.sort((a, b) => b.level - a.level);

            // Nomes e cores dos times
            const teamConfigs = [
                { name: 'Vermelho', color: '#EF4444' },
                { name: 'Azul', color: '#3B82F6' },
                { name: 'Verde', color: '#10B981' },
                { name: 'Preto', color: '#1F2937' }
            ];

            // Criar apenas o número necessário de times
            const teams = [];
            for (let i = 0; i < numTeams; i++) {
                teams.push({
                    name: teamConfigs[i].name,
                    color: teamConfigs[i].color,
                    players: []
                });
            }

            // Distribuir jogadores de forma balanceada
            players.forEach((player, index) => {
                teams[index % numTeams].players.push(player);
            });

            AppState.teams = teams;
            saveState();
            return teams;
        }

        // ============================================
        // NAVEGAÇÃO
        // ============================================
        function navigateTo(view, data = null) {
            AppState.currentView = view;
            if (data) {
                if (view === 'game-detail') AppState.currentGame = data;
                if (view === 'match') AppState.currentMatch = data;
            }
            render();
        }

        // ============================================
        // COMPONENTES DE UI
        // ============================================

        // Tela de Login
        function LoginScreen() {
            return `
                <div class="min-h-screen flex items-center justify-center p-4 animate-fadeIn">
                    <div class="w-full max-w-md">
                        <!-- Logo -->
                        <div class="text-center mb-8 animate-bounce">
                            <div class="inline-block text-6xl mb-4">🏐</div>
                            <h1 class="title-font text-5xl text-white mb-2">VOLEIPRO</h1>
                            <p class="text-gray-400">Gestão Profissional de Jogos</p>
                        </div>

                        <!-- Card de Login -->
                        <div class="glass-card rounded-2xl p-8 shadow-2xl">
                            <form onsubmit="handleLogin(event)" class="space-y-6">
                                <div>
                                    <label class="block text-white font-medium mb-2">
                                        <i class="fas fa-envelope mr-2"></i>Email
                                    </label>
                                    <input type="email" id="login-email" required
                                        class="custom-input w-full px-4 py-3 rounded-lg text-white"
                                        placeholder="seu@email.com" value="admin@volei.com">
                                </div>

                                <div>
                                    <label class="block text-white font-medium mb-2">
                                        <i class="fas fa-lock mr-2"></i>Senha
                                    </label>
                                    <input type="password" id="login-password" required
                                        class="custom-input w-full px-4 py-3 rounded-lg text-white"
                                        placeholder="••••••••" value="123">
                                </div>

                                <button type="submit"
                                    class="btn-primary w-full py-3 rounded-lg text-white font-bold text-lg">
                                    ENTRAR
                                </button>
                            </form>

                            <div class="mt-6 text-center">
                                <button onclick="navigateTo('register')"
                                    class="text-orange-400 hover:text-orange-300 font-medium">
                                    Não tem conta? Cadastre-se
                                </button>
                            </div>

                            <div class="mt-6 pt-6 border-t border-gray-700">
                                <p class="text-gray-400 text-sm text-center">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Use: admin@volei.com / 123
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // Tela de Registro
        function RegisterScreen() {
            return `
                <div class="min-h-screen flex items-center justify-center p-4 animate-fadeIn">
                    <div class="w-full max-w-md">
                        <div class="text-center mb-6">
                            <button onclick="navigateTo('login')"
                                class="text-gray-400 hover:text-white mb-4">
                                <i class="fas fa-arrow-left mr-2"></i>Voltar
                            </button>
                            <h1 class="title-font text-4xl text-white mb-2">CRIAR CONTA</h1>
                        </div>

                        <div class="glass-card rounded-2xl p-8 shadow-2xl">
                            <form onsubmit="handleRegister(event)" class="space-y-5">
                                <div>
                                    <label class="block text-white font-medium mb-2">
                                        <i class="fas fa-user mr-2"></i>Nome Completo
                                    </label>
                                    <input type="text" id="reg-name" required
                                        class="custom-input w-full px-4 py-3 rounded-lg text-white"
                                        placeholder="João Silva">
                                </div>

                                <div>
                                    <label class="block text-white font-medium mb-2">
                                        <i class="fas fa-envelope mr-2"></i>Email
                                    </label>
                                    <input type="email" id="reg-email" required
                                        class="custom-input w-full px-4 py-3 rounded-lg text-white"
                                        placeholder="seu@email.com">
                                </div>

                                <div>
                                    <label class="block text-white font-medium mb-2">
                                        <i class="fas fa-lock mr-2"></i>Senha
                                    </label>
                                    <input type="password" id="reg-password" required
                                        class="custom-input w-full px-4 py-3 rounded-lg text-white"
                                        placeholder="••••••••">
                                </div>

                                <div>
                                    <label class="block text-white font-medium mb-3">
                                        <i class="fas fa-wallet mr-2"></i>Tipo de Pagamento
                                    </label>
                                    <div class="grid grid-cols-2 gap-3">
                                        <label class="cursor-pointer">
                                            <input type="radio" name="payment-type" value="monthly" checked class="hidden peer">
                                            <div class="bg-gray-700/50 peer-checked:bg-orange-500/30 peer-checked:border-orange-500 border-2 border-gray-600 rounded-lg p-4 text-center transition">
                                                <i class="fas fa-calendar-alt text-2xl mb-2 text-orange-400"></i>
                                                <div class="text-white font-bold">Mensalista</div>
                                                <div class="text-gray-400 text-xs">Pagamento mensal</div>
                                            </div>
                                        </label>
                                        <label class="cursor-pointer">
                                            <input type="radio" name="payment-type" value="daily" class="hidden peer">
                                            <div class="bg-gray-700/50 peer-checked:bg-blue-500/30 peer-checked:border-blue-500 border-2 border-gray-600 rounded-lg p-4 text-center transition">
                                                <i class="fas fa-ticket-alt text-2xl mb-2 text-blue-400"></i>
                                                <div class="text-white font-bold">Diarista</div>
                                                <div class="text-gray-400 text-xs">Pagamento por jogo</div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                <button type="submit"
                                    class="btn-primary w-full py-3 rounded-lg text-white font-bold text-lg">
                                    CRIAR CONTA
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
        }

        // Dashboard Principal
        function DashboardScreen() {
            const openGames = AppState.games.filter(g => g.status === 'open');
            const isAdmin = AppState.currentUser?.role === 'admin';

            return `
                <div class="min-h-screen pb-20 animate-fadeIn">
                    <!-- Header -->
                    <div class="gradient-orange p-6 shadow-lg">
                        <div class="flex items-center justify-between mb-4">
                            <div class="flex items-center space-x-3">
                                <div class="text-4xl">${AppState.currentUser.photo}</div>
                                <div>
                                    <h2 class="text-white font-bold text-xl">${AppState.currentUser.name}</h2>
                                    <p class="text-orange-100 text-sm">
                                        <i class="fas fa-trophy mr-1"></i>
                                        ${AppState.currentUser.stats.championships} Títulos
                                    </p>
                                </div>
                            </div>
                            <button onclick="logout()" class="text-white hover:bg-white/20 p-2 rounded-lg transition">
                                <i class="fas fa-sign-out-alt text-xl"></i>
                            </button>
                        </div>

                        <!-- Stats Rápidas -->
                        <div class="grid grid-cols-3 gap-3 mt-4">
                            <div class="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                                <div class="level-badge level-${AppState.currentUser.level} mx-auto mb-1">
                                    ${AppState.currentUser.level}
                                </div>
                                <p class="text-white text-xs">Nível</p>
                            </div>
                            <div class="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                                <div class="text-2xl font-bold text-white">${AppState.currentUser.stats.wins}</div>
                                <p class="text-white text-xs">Vitórias</p>
                            </div>
                            <div class="bg-white/10 backdrop-blur rounded-lg p-3 text-center">
                                <div class="text-2xl font-bold text-white">
                                    ${Math.round((AppState.currentUser.stats.wins / (AppState.currentUser.stats.wins + AppState.currentUser.stats.losses)) * 100)}%
                                </div>
                                <p class="text-white text-xs">Taxa</p>
                            </div>
                        </div>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Botões Admin -->
                        ${isAdmin ? `
                            <div class="space-y-3">
                                <button onclick="showCreateGameModal()"
                                    class="btn-primary w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg">
                                    <i class="fas fa-plus-circle mr-2"></i>CRIAR NOVO JOGO
                                </button>
                                <div class="grid grid-cols-2 gap-3">
                                    <button onclick="navigateTo('users')"
                                        class="btn-secondary w-full py-4 rounded-xl text-white font-bold shadow-lg">
                                        <i class="fas fa-users-cog mr-2"></i>USUÁRIOS
                                    </button>
                                    <button onclick="navigateTo('payments')"
                                        class="bg-green-600 hover:bg-green-700 w-full py-4 rounded-xl text-white font-bold shadow-lg">
                                        <i class="fas fa-wallet mr-2"></i>MENSALIDADES
                                    </button>
                                </div>
                                <button onclick="navigateTo('financial')"
                                    class="bg-purple-600 hover:bg-purple-700 w-full py-4 rounded-xl text-white font-bold shadow-lg">
                                    <i class="fas fa-chart-line mr-2"></i>CONTROLE FINANCEIRO
                                </button>
                            </div>
                        ` : ''}

                        <!-- Jogos Abertos -->
                        <div>
                            <h3 class="text-white font-bold text-xl mb-4">
                                <i class="fas fa-calendar-check mr-2 text-orange-400"></i>
                                Jogos Disponíveis
                            </h3>
                            <div class="space-y-4">
                                ${openGames.length > 0 ? openGames.map(game => GameCard(game)).join('') :
                                    '<p class="text-gray-400 text-center py-8">Nenhum jogo disponível no momento</p>'}
                            </div>
                        </div>

                        <!-- Últimos Resultados -->
                        <div>
                            <h3 class="text-white font-bold text-xl mb-4">
                                <i class="fas fa-trophy mr-2 text-yellow-400"></i>
                                Últimos Campeões
                            </h3>
                            ${AppState.games.filter(g => g.status === 'finished').slice(-3).reverse().map(game => `
                                <div class="glass-card rounded-xl p-4 mb-3">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <div class="text-yellow-400 font-bold text-lg">
                                                <i class="fas fa-crown mr-2"></i>${game.champion}
                                            </div>
                                            <div class="text-gray-400 text-sm">${game.date}</div>
                                        </div>
                                        <div class="text-3xl">🏆</div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Bottom Navigation -->
                    ${BottomNav('dashboard')}
                </div>
            `;
        }

        // Card de Jogo
        function GameCard(game) {
            const isJoined = game.players.some(p => {
                const userId = typeof p === 'object' ? p.userId : p;
                return userId === AppState.currentUser.id;
            });
            const { mainPlayers, reservePlayers } = splitMainAndReserve(game);
            const isFull = mainPlayers.length >= game.maxPlayers;
            const isInProgress = game.status === 'in_progress';
            const isReserve = reservePlayers.some(p => p.id === AppState.currentUser.id);

            return `
                <div class="glass-card rounded-xl p-5 shadow-lg hover:shadow-2xl transition ${isInProgress ? 'border-2 border-green-500' : ''}">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <div class="text-white font-bold text-lg mb-1">
                                <i class="fas fa-calendar mr-2 text-orange-400"></i>
                                ${new Date(game.date).toLocaleDateString('pt-BR')}
                            </div>
                            <div class="text-gray-400 text-sm">
                                <i class="fas fa-users mr-2"></i>
                                ${game.players.length}/${game.maxPlayers} jogadores
                            </div>
                            ${isInProgress ? `
                                <div class="text-green-400 text-sm font-bold mt-1">
                                    <i class="fas fa-play-circle mr-1 animate-pulse"></i>
                                    Jogo em Andamento
                                </div>
                            ` : ''}
                        </div>
                        <div class="text-3xl animate-bounce">🏐</div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="bg-gray-700 rounded-full h-2 mb-4">
                        <div class="${isInProgress ? 'bg-green-500' : 'gradient-orange'} h-2 rounded-full transition-all duration-500"
                            style="width: ${(game.players.length / game.maxPlayers) * 100}%"></div>
                    </div>

                    <div class="flex gap-2">
                        ${!isJoined && !isInProgress ? `
                            <button onclick="handleJoinGame(${game.id})"
                                class="btn-primary flex-1 py-3 rounded-lg text-white font-bold">
                                <i class="fas fa-user-plus mr-2"></i>PARTICIPAR
                            </button>
                        ` : ''}

                        ${isJoined && !isInProgress ? `
                            <button onclick="handleLeaveGame(${game.id})"
                                class="bg-red-500 hover:bg-red-600 flex-1 py-3 rounded-lg text-white font-bold">
                                <i class="fas fa-user-minus mr-2"></i>SAIR${isReserve ? ' (SUPLENTE)' : ''}
                            </button>
                        ` : ''}

                        ${isJoined && isInProgress ? `
                            <div class="flex-1 bg-green-500/20 border border-green-500 py-3 px-4 rounded-lg text-green-300 text-center font-bold text-sm">
                                <i class="fas fa-check mr-2"></i>Você está participando
                            </div>
                        ` : ''}

                        ${!isJoined && isInProgress ? `
                            <div class="flex-1 bg-yellow-500/20 border border-yellow-500 py-3 px-4 rounded-lg text-yellow-300 text-center font-bold text-sm">
                                <i class="fas fa-lock mr-2"></i>Lista Fechada
                            </div>
                        ` : ''}

                        <button onclick="navigateTo('game-detail', ${JSON.stringify(game).replace(/"/g, '&quot;')})"
                            class="btn-secondary px-6 py-3 rounded-lg text-white font-bold">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            `;
        }

        // Detalhes do Jogo
        function GameDetailScreen() {
            const game = AppState.currentGame;
            const isAdmin = AppState.currentUser?.role === 'admin';
            const { mainPlayers, reservePlayers } = splitMainAndReserve(game);
            const players = [...mainPlayers, ...reservePlayers];

            return `
                <div class="min-h-screen pb-20 animate-fadeIn">
                    <!-- Header -->
                    <div class="gradient-blue p-6">
                        <button onclick="navigateTo('dashboard')"
                            class="text-white mb-4 hover:bg-white/20 px-3 py-2 rounded-lg transition">
                            <i class="fas fa-arrow-left mr-2"></i>Voltar
                        </button>
                        <h1 class="title-font text-3xl text-white mb-2">DETALHES DO JOGO</h1>
                        <p class="text-blue-100">
                            <i class="fas fa-calendar mr-2"></i>
                            ${new Date(game.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Status do Jogo -->
                        ${game.status === 'in_progress' ? `
                            <div class="bg-green-500/20 border-2 border-green-500 rounded-xl p-4 text-center animate-pulse">
                                <i class="fas fa-play-circle text-green-400 text-3xl mb-2"></i>
                                <div class="text-green-300 font-bold text-lg">JOGO EM ANDAMENTO</div>
                                <div class="text-green-400 text-sm">A lista de participantes está bloqueada</div>
                            </div>
                        ` : ''}

                        <!-- Configurações do Jogo -->
                        <div class="glass-card rounded-xl p-5">
                            <h3 class="text-white font-bold text-lg mb-3">
                                <i class="fas fa-cog mr-2 text-orange-400"></i>
                                Configurações
                            </h3>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="bg-blue-500/20 border border-blue-500 rounded-lg p-3 text-center">
                                    <div class="text-2xl font-bold text-blue-400">${game.teamSize}</div>
                                    <div class="text-gray-300 text-xs">Jogadores/Time</div>
                                </div>
                                <div class="bg-${game.twoWinsRule && game.players.length >= game.teamSize * 4 ? 'green' : 'gray'}-500/20 border border-${game.twoWinsRule && game.players.length >= game.teamSize * 4 ? 'green' : 'gray'}-500 rounded-lg p-3 text-center">
                                    <i class="fas fa-${game.twoWinsRule && game.players.length >= game.teamSize * 4 ? 'check' : 'times'} text-${game.twoWinsRule && game.players.length >= game.teamSize * 4 ? 'green' : 'gray'}-400 text-2xl"></i>
                                    <div class="text-gray-300 text-xs">Ganhou 2 Sai${game.twoWinsRule && game.players.length < game.teamSize * 4 ? ' (Inativa)' : ''}</div>
                                </div>
                            </div>
                            ${game.twoWinsRule && game.players.length < game.teamSize * 4 ? `
                                <div class="mt-3 text-center text-yellow-400 text-xs">
                                    <i class="fas fa-info-circle mr-1"></i>
                                    Regra "Ganhou 2 Sai" requer ${game.teamSize * 4} jogadores (4 times)
                                </div>
                            ` : ''}
                        </div>

                        <!-- Status -->
                        <div class="glass-card rounded-xl p-5">
                            <h3 class="text-white font-bold text-lg mb-3">Status</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="text-center">
                                    <div class="text-3xl font-bold gradient-orange bg-clip-text text-transparent">
                                        ${game.players.length}
                                    </div>
                                    <div class="text-gray-400 text-sm">Confirmados</div>
                                </div>
                                <div class="text-center">
                                    <div class="text-3xl font-bold gradient-yellow bg-clip-text text-transparent">
                                        ${game.maxPlayers - game.players.length}
                                    </div>
                                    <div class="text-gray-400 text-sm">Vagas</div>
                                </div>
                            </div>
                        </div>

                        <!-- Lista Principal -->
                        ${mainPlayers.length > 0 ? `
                            <div class="glass-card rounded-xl p-5 border-2 border-green-500">
                                <div class="flex items-center justify-between mb-4">
                                    <h3 class="text-white font-bold text-lg">
                                        <i class="fas fa-check-circle mr-2 text-green-400"></i>
                                        Lista Principal (${mainPlayers.length}/${game.maxPlayers})
                                    </h3>
                                    ${isAdmin && game.status === 'open' ? `
                                        <button onclick="showAddVisitorModal(${game.id})"
                                            class="btn-primary px-4 py-2 rounded-lg text-white text-sm font-bold">
                                            <i class="fas fa-user-plus mr-1"></i>Visitante
                                        </button>
                                    ` : ''}
                                </div>
                                <div class="space-y-3 max-h-96 overflow-y-auto hide-scrollbar">
                                    ${mainPlayers.map((player, index) => `
                                        <div class="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                                            <div class="flex items-center space-x-3">
                                                <div class="text-gray-400 font-bold w-6">#${index + 1}</div>
                                                <div class="text-2xl">${player.photo}</div>
                                                <div>
                                                    <div class="text-white font-medium">
                                                        ${player.name}
                                                        ${player.role === 'visitor' ? '<span class="text-xs text-yellow-400 ml-2">(Visitante)</span>' : ''}
                                                        ${player.paymentType === 'monthly' ? '<span class="text-xs text-green-400 ml-2">💰</span>' : ''}
                                                    </div>
                                                    <div class="text-gray-400 text-sm">
                                                        ${player.stats.wins}V / ${player.stats.losses}D
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <div class="level-badge level-${player.level}">
                                                    ${player.level}
                                                </div>
                                                ${isAdmin && game.status === 'open' ? `
                                                    <button onclick="handleRemovePlayer(${game.id}, ${player.id})"
                                                        class="text-red-400 hover:text-red-300 p-2">
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Suplentes -->
                        ${reservePlayers.length > 0 ? `
                            <div class="glass-card rounded-xl p-5 border-2 border-yellow-500">
                                <h3 class="text-white font-bold text-lg mb-4">
                                    <i class="fas fa-clock mr-2 text-yellow-400"></i>
                                    Suplentes (${reservePlayers.length})
                                </h3>
                                <div class="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mb-3 text-center">
                                    <i class="fas fa-info-circle text-yellow-400 mr-2"></i>
                                    <span class="text-yellow-300 text-sm">
                                        ${new Date() < new Date(new Date(game.date).setHours(15, 0, 0)) ?
                                            'Suplentes sobem para a lista às 15h se houver vagas' :
                                            'Suplentes podem subir se alguém da lista sair'}
                                    </span>
                                </div>
                                <div class="space-y-3 max-h-64 overflow-y-auto hide-scrollbar">
                                    ${reservePlayers.map((player, index) => `
                                        <div class="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                                            <div class="flex items-center space-x-3">
                                                <div class="text-yellow-400 font-bold w-6">#${index + 1}</div>
                                                <div class="text-2xl">${player.photo}</div>
                                                <div>
                                                    <div class="text-white font-medium">
                                                        ${player.name}
                                                        ${player.role === 'visitor' ? '<span class="text-xs text-yellow-400 ml-2">(Visitante)</span>' : ''}
                                                        <span class="text-xs text-cyan-400 ml-2">🎫 Diarista</span>
                                                    </div>
                                                    <div class="text-gray-400 text-sm">
                                                        ${player.stats.wins}V / ${player.stats.losses}D
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <div class="level-badge level-${player.level}">
                                                    ${player.level}
                                                </div>
                                                ${isAdmin && game.status === 'open' ? `
                                                    <button onclick="handleRemovePlayer(${game.id}, ${player.id})"
                                                        class="text-red-400 hover:text-red-300 p-2">
                                                        <i class="fas fa-times"></i>
                                                    </button>
                                                ` : ''}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Ações Admin -->
                        ${isAdmin && game.status === 'open' && players.length >= (game.teamSize * 2) ? `
                            <button onclick="handleCreateTeams(${game.id})"
                                class="btn-primary w-full py-4 rounded-xl text-white font-bold text-lg">
                                <i class="fas fa-users-cog mr-2"></i>CRIAR TIMES E INICIAR
                            </button>
                        ` : ''}

                        ${isAdmin && game.status === 'open' && players.length < (game.teamSize * 2) ? `
                            <div class="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4 text-center">
                                <i class="fas fa-exclamation-triangle text-yellow-400 mr-2"></i>
                                <span class="text-yellow-300">Mínimo de ${game.teamSize * 2} jogadores para criar times (${game.teamSize} por time)</span>
                            </div>
                        ` : ''}

                        ${game.status === 'in_progress' ? `
                            <button onclick="navigateTo('play')"
                                class="bg-green-500 hover:bg-green-600 w-full py-4 rounded-xl text-white font-bold text-lg animate-pulse">
                                <i class="fas fa-play-circle mr-2"></i>IR PARA O JOGO
                            </button>
                        ` : ''}
                    </div>

                    ${BottomNav('games')}
                </div>
            `;
        }

        // Tela de Times (redireciona para Play se houver times)
        function TeamsScreen() {
            if (AppState.teams.length > 0) {
                navigateTo('play');
                return '';
            }

            return `
                <div class="min-h-screen pb-20 animate-fadeIn">
                    <div class="gradient-orange p-6">
                        <h1 class="title-font text-3xl text-white mb-2">TIMES</h1>
                        <p class="text-orange-100">Gerencie os times do jogo</p>
                    </div>

                    <div class="p-6">
                        <div class="glass-card rounded-xl p-8 text-center">
                            <div class="text-6xl mb-4">👥</div>
                            <h3 class="text-white text-xl font-bold mb-2">Nenhum Time Criado</h3>
                            <p class="text-gray-400 mb-6">Crie times a partir de um jogo com jogadores confirmados</p>
                            <button onclick="navigateTo('games')"
                                class="btn-primary px-6 py-3 rounded-lg text-white font-bold">
                                <i class="fas fa-calendar mr-2"></i>Ver Jogos
                            </button>
                        </div>
                    </div>

                    ${BottomNav('games')}
                </div>
            `;
        }

        // Tela Play (Gerenciamento do Jogo)
        function PlayScreen() {
            // Se não tem times criados E não tem jogo ativo
            if (AppState.teams.length === 0 && !AppState.activeMatch) {
                return `
                    <div class="min-h-screen pb-20 animate-fadeIn">
                        <div class="gradient-orange p-6">
                            <h1 class="title-font text-3xl text-white mb-2">JOGO</h1>
                            <p class="text-orange-100">Gerencie o jogo em andamento</p>
                        </div>

                        <div class="p-6">
                            <div class="glass-card rounded-xl p-8 text-center">
                                <div class="text-6xl mb-4">🏐</div>
                                <h3 class="text-white text-xl font-bold mb-2">Nenhum Jogo em Andamento</h3>
                                <p class="text-gray-400 mb-6">Crie times para começar um jogo</p>
                                <button onclick="navigateTo('dashboard')"
                                    class="btn-primary px-6 py-3 rounded-lg text-white font-bold">
                                    <i class="fas fa-home mr-2"></i>Ir para Jogos
                                </button>
                            </div>
                        </div>

                        ${BottomNav('play')}
                    </div>
                `;
            }

            // Se tem times OU tem jogo ativo, mostra a tela com times
            return TeamsWithMatchScreen();
        }

        // Tela de Times com Controle de Partida
        function TeamsWithMatchScreen() {
            const match = AppState.activeMatch;
            const isAdmin = AppState.currentUser?.role === 'admin';

            return `
                <div class="min-h-screen pb-20 animate-fadeIn">
                    <div class="gradient-orange p-6">
                        <h1 class="title-font text-3xl text-white mb-2">
                            <i class="fas fa-play-circle mr-2"></i>JOGO EM ANDAMENTO
                        </h1>
                        <p class="text-orange-100">Times e Placar</p>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Placar Atual -->
                        ${match ? `
                            <div class="glass-card rounded-xl p-6">
                                <h3 class="text-white font-bold text-lg mb-4 text-center">
                                    <i class="fas fa-trophy mr-2 text-yellow-400"></i>
                                    Partida Atual
                                </h3>
                                <div class="grid grid-cols-2 gap-4 mb-4">
                                    <div class="text-center">
                                        <div class="inline-block px-4 py-2 rounded-full text-white font-bold mb-2"
                                            style="background: ${match.team1.color}">
                                            ${match.team1.name}
                                        </div>
                                        <div class="text-5xl font-bold text-white">${match.score1}</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="inline-block px-4 py-2 rounded-full text-white font-bold mb-2"
                                            style="background: ${match.team2.color}">
                                            ${match.team2.name}
                                        </div>
                                        <div class="text-5xl font-bold text-white">${match.score2}</div>
                                    </div>
                                </div>
                                ${isAdmin ? `
                                    <button onclick="navigateTo('match')"
                                        class="btn-secondary w-full py-3 rounded-lg text-white font-bold">
                                        <i class="fas fa-edit mr-2"></i>CONTROLAR PLACAR
                                    </button>
                                ` : ''}
                            </div>
                        ` : ''}

                        <!-- Times -->
                        ${AppState.teams.map((team, index) => `
                            <div class="glass-card rounded-xl overflow-hidden shadow-lg animate-fadeIn"
                                style="animation-delay: ${index * 0.1}s">
                                <div class="p-4" style="background: linear-gradient(135deg, ${team.color}dd 0%, ${team.color}99 100%)">
                                    <h3 class="text-white font-bold text-xl">
                                        <i class="fas fa-shield-alt mr-2"></i>
                                        Time ${team.name}
                                    </h3>
                                    <p class="text-white/80 text-sm">
                                        Nível médio: ${(team.players.reduce((sum, p) => sum + p.level, 0) / team.players.length).toFixed(1)}
                                    </p>
                                </div>
                                <div class="p-4 space-y-3">
                                    ${team.players.map(player => `
                                        <div class="flex items-center justify-between">
                                            <div class="flex items-center space-x-3">
                                                <div class="text-2xl">${player.photo}</div>
                                                <div>
                                                    <div class="text-white font-medium">${player.name}</div>
                                                    <div class="text-gray-400 text-sm">
                                                        ${player.stats.wins}V / ${player.stats.losses}D
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="level-badge level-${player.level}">
                                                ${player.level}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}

                        <!-- Histórico de Partidas -->
                        ${AppState.matchHistory.length > 0 ? `
                            <div class="glass-card rounded-xl p-5">
                                <h3 class="text-white font-bold text-lg mb-4">
                                    <i class="fas fa-history mr-2 text-yellow-400"></i>
                                    Histórico (${AppState.matchHistory.length} partida${AppState.matchHistory.length > 1 ? 's' : ''})
                                </h3>
                                <div class="space-y-3 max-h-96 overflow-y-auto hide-scrollbar">
                                    ${AppState.matchHistory.slice().reverse().map((m, index) => `
                                        <div class="bg-gray-700/50 rounded-lg p-3">
                                            <div class="flex items-center justify-between mb-2">
                                                <span class="text-gray-400 text-sm">Partida #${m.matchNumber}</span>
                                                <span class="text-yellow-400 text-xs">
                                                    <i class="fas fa-trophy mr-1"></i>${m.winner}
                                                </span>
                                            </div>
                                            <div class="grid grid-cols-3 gap-2 items-center">
                                                <div class="text-right">
                                                    <div class="text-white font-bold">${m.team1.name}</div>
                                                    <div class="text-2xl font-bold ${m.score1 > m.score2 ? 'text-green-400' : 'text-gray-500'}">
                                                        ${m.score1}
                                                    </div>
                                                </div>
                                                <div class="text-center text-gray-500 font-bold">X</div>
                                                <div class="text-left">
                                                    <div class="text-white font-bold">${m.team2.name}</div>
                                                    <div class="text-2xl font-bold ${m.score2 > m.score1 ? 'text-green-400' : 'text-gray-500'}">
                                                        ${m.score2}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- Estatísticas por Time -->
                            <div class="glass-card rounded-xl p-5">
                                <h3 class="text-white font-bold text-lg mb-4">
                                    <i class="fas fa-chart-bar mr-2 text-orange-400"></i>
                                    Placar Geral
                                </h3>
                                <div class="space-y-3">
                                    ${(() => {
                                        const teamWins = {};
                                        AppState.matchHistory.forEach(match => {
                                            teamWins[match.winner] = (teamWins[match.winner] || 0) + 1;
                                        });

                                        return AppState.teams.map(team => {
                                            const wins = teamWins[team.name] || 0;
                                            return `
                                                <div class="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                                                    <div class="flex items-center space-x-3">
                                                        <div class="w-4 h-4 rounded-full" style="background: ${team.color}"></div>
                                                        <span class="text-white font-bold">${team.name}</span>
                                                    </div>
                                                    <div class="text-2xl font-bold text-green-400">${wins}</div>
                                                </div>
                                            `;
                                        }).join('');
                                    })()}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Ações -->
                        ${isAdmin ? `
                            ${!match ? `
                                <button onclick="handleStartMatch()"
                                    class="btn-primary w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg animate-pulse">
                                    <i class="fas fa-play-circle mr-2"></i>${AppState.matchHistory.length === 0 ? 'INICIAR PRIMEIRA PARTIDA' : 'INICIAR PRÓXIMA PARTIDA'}
                                </button>
                            ` : ''}
                            <button onclick="finishGame()"
                                class="bg-red-500 hover:bg-red-600 w-full py-4 rounded-xl text-white font-bold text-lg">
                                <i class="fas fa-flag-checkered mr-2"></i>FINALIZAR JOGO
                            </button>
                        ` : ''}
                    </div>

                    ${BottomNav('play')}
                </div>
            `;
        }

        // Tela de Placar
        function MatchScreen() {
            const match = AppState.activeMatch;

            if (!match) {
                navigateTo('play');
                return '';
            }

            return `
                <div class="min-h-screen pb-20 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 animate-fadeIn">
                    <!-- Header -->
                    <div class="gradient-blue p-4">
                        <button onclick="navigateTo('play')"
                            class="text-white hover:bg-white/20 px-3 py-2 rounded-lg transition">
                            <i class="fas fa-arrow-left mr-2"></i>Voltar ao Jogo
                        </button>
                    </div>

                    <div class="p-6">
                        <!-- Placar Principal -->
                        <div class="glass-card rounded-2xl p-6 mb-6">
                            <div class="text-center mb-6">
                                <h2 class="text-white/60 text-sm uppercase tracking-wider mb-2">Partida em Andamento</h2>
                                <div class="text-orange-400 font-bold">
                                    Até ${match.maxPoints} pontos
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 mb-6">
                                <!-- Time 1 -->
                                <div class="text-center">
                                    <div class="mb-3">
                                        <div class="inline-block px-4 py-2 rounded-full text-white font-bold mb-2"
                                            style="background: ${match.team1.color}">
                                            ${match.team1.name}
                                        </div>
                                    </div>
                                    <div class="score-display text-white mb-4">
                                        ${match.score1}
                                    </div>
                                    ${AppState.currentUser?.role === 'admin' && !match.finished ? `
                                        <div class="flex gap-2 justify-center">
                                            <button onclick="updateScore(1, -1)"
                                                class="bg-red-500 hover:bg-red-600 w-12 h-12 rounded-full text-white font-bold text-xl">
                                                -
                                            </button>
                                            <button onclick="updateScore(1, 1)"
                                                class="bg-green-500 hover:bg-green-600 w-12 h-12 rounded-full text-white font-bold text-xl">
                                                +
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>

                                <!-- Time 2 -->
                                <div class="text-center">
                                    <div class="mb-3">
                                        <div class="inline-block px-4 py-2 rounded-full text-white font-bold mb-2"
                                            style="background: ${match.team2.color}">
                                            ${match.team2.name}
                                        </div>
                                    </div>
                                    <div class="score-display text-white mb-4">
                                        ${match.score2}
                                    </div>
                                    ${AppState.currentUser?.role === 'admin' && !match.finished ? `
                                        <div class="flex gap-2 justify-center">
                                            <button onclick="updateScore(2, -1)"
                                                class="bg-red-500 hover:bg-red-600 w-12 h-12 rounded-full text-white font-bold text-xl">
                                                -
                                            </button>
                                            <button onclick="updateScore(2, 1)"
                                                class="bg-green-500 hover:bg-green-600 w-12 h-12 rounded-full text-white font-bold text-xl">
                                                +
                                            </button>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>

                            ${match.finished ? `
                                <div class="text-center py-6">
                                    <div class="text-4xl mb-3">🏆</div>
                                    <div class="text-yellow-400 font-bold text-2xl mb-2">
                                        Time ${match.score1 > match.score2 ? match.team1.name : match.team2.name} Venceu!
                                    </div>
                                    <button onclick="resetMatch()"
                                        class="btn-primary mt-4 px-6 py-3 rounded-lg text-white font-bold">
                                        <i class="fas fa-redo mr-2"></i>Nova Partida
                                    </button>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Jogadores dos Times -->
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            ${[match.team1, match.team2].map(team => `
                                <div class="glass-card rounded-xl p-4">
                                    <h3 class="text-white font-bold mb-3 flex items-center">
                                        <div class="w-3 h-3 rounded-full mr-2" style="background: ${team.color}"></div>
                                        ${team.name}
                                    </h3>
                                    <div class="space-y-2">
                                        ${team.players.map(p => `
                                            <div class="flex items-center space-x-2 text-sm">
                                                <div>${p.photo}</div>
                                                <div class="text-white">${p.name}</div>
                                                <div class="level-badge level-${p.level} !w-6 !h-6 !text-xs ml-auto">
                                                    ${p.level}
                                                </div>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }

        // Tela de Estatísticas
        function StatsScreen() {
            const user = AppState.currentUser;
            const totalGames = user.stats.wins + user.stats.losses;
            const winRate = totalGames > 0 ? ((user.stats.wins / totalGames) * 100).toFixed(1) : 0;

            return `
                <div class="min-h-screen pb-20 animate-fadeIn">
                    <div class="gradient-yellow p-6">
                        <h1 class="title-font text-3xl text-white mb-2">ESTATÍSTICAS</h1>
                        <p class="text-yellow-100">Seu desempenho em detalhes</p>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Card Principal -->
                        <div class="glass-card rounded-xl p-6">
                            <div class="flex items-center justify-between mb-6">
                                <div class="flex items-center space-x-4">
                                    <div class="text-5xl">${user.photo}</div>
                                    <div>
                                        <h2 class="text-white font-bold text-2xl">${user.name}</h2>
                                        <p class="text-gray-400">Jogador desde 2024</p>
                                    </div>
                                </div>
                                <div class="level-badge level-${user.level} !w-16 !h-16 !text-2xl">
                                    ${user.level}
                                </div>
                            </div>

                            <!-- Estatísticas Grid -->
                            <div class="grid grid-cols-2 gap-4">
                                <div class="bg-green-500/20 border border-green-500 rounded-lg p-4 text-center">
                                    <div class="text-3xl font-bold text-green-400">${user.stats.wins}</div>
                                    <div class="text-gray-300 text-sm">Vitórias</div>
                                </div>
                                <div class="bg-red-500/20 border border-red-500 rounded-lg p-4 text-center">
                                    <div class="text-3xl font-bold text-red-400">${user.stats.losses}</div>
                                    <div class="text-gray-300 text-sm">Derrotas</div>
                                </div>
                                <div class="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 text-center">
                                    <div class="text-3xl font-bold text-yellow-400">${winRate}%</div>
                                    <div class="text-gray-300 text-sm">Taxa de Vitória</div>
                                </div>
                                <div class="bg-orange-500/20 border border-orange-500 rounded-lg p-4 text-center">
                                    <div class="text-3xl font-bold text-orange-400">${user.stats.championships}</div>
                                    <div class="text-gray-300 text-sm">Títulos</div>
                                </div>
                            </div>
                        </div>

                        <!-- Evolução de Nível -->
                        <div class="glass-card rounded-xl p-6">
                            <h3 class="text-white font-bold text-lg mb-4">
                                <i class="fas fa-chart-line mr-2 text-orange-400"></i>
                                Evolução de Nível
                            </h3>
                            <div class="space-y-3">
                                ${[6, 5, 4, 3, 2, 1].map(level => `
                                    <div class="flex items-center space-x-3">
                                        <div class="level-badge level-${level} !w-8 !h-8 !text-sm">${level}</div>
                                        <div class="flex-1">
                                            <div class="bg-gray-700 rounded-full h-3 overflow-hidden">
                                                <div class="h-full level-${level} transition-all duration-1000"
                                                    style="width: ${user.level >= level ? '100%' : '0%'}">
                                                </div>
                                            </div>
                                        </div>
                                        <div class="text-white text-sm font-medium w-16 text-right">
                                            ${user.level === level ? 'Atual' : user.level > level ? 'Concluído' : 'Bloqueado'}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Ranking Global (Mock) -->
                        <div class="glass-card rounded-xl p-6">
                            <h3 class="text-white font-bold text-lg mb-4">
                                <i class="fas fa-trophy mr-2 text-yellow-400"></i>
                                Ranking Global
                            </h3>
                            <div class="space-y-3">
                                ${AppState.users
                                    .filter(u => u.role !== 'visitor')
                                    .sort((a, b) => b.stats.wins - a.stats.wins)
                                    .slice(0, 5)
                                    .map((u, index) => `
                                        <div class="flex items-center space-x-3 ${u.id === user.id ? 'bg-orange-500/20 border border-orange-500 rounded-lg p-2' : ''}">
                                            <div class="text-2xl font-bold ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-600' : 'text-gray-500'} w-8">
                                                #${index + 1}
                                            </div>
                                            <div class="text-xl">${u.photo}</div>
                                            <div class="flex-1">
                                                <div class="text-white font-medium">${u.name}</div>
                                                <div class="text-gray-400 text-sm">${u.stats.wins} vitórias</div>
                                            </div>
                                            <div class="level-badge level-${u.level}">${u.level}</div>
                                        </div>
                                    `).join('')}
                            </div>
                        </div>
                    </div>

                    ${BottomNav('stats')}
                </div>
            `;
        }

        // Tela de Gerenciamento de Usuários (Admin apenas)
        function UsersScreen() {
            if (AppState.currentUser?.role !== 'admin') {
                navigateTo('dashboard');
                return '';
            }

            const allUsers = AppState.users.sort((a, b) => {
                // Admins primeiro
                if (a.role === 'admin' && b.role !== 'admin') return -1;
                if (a.role !== 'admin' && b.role === 'admin') return 1;
                // Depois por nível
                return b.level - a.level;
            });

            return `
                <div class="min-h-screen pb-20 animate-fadeIn">
                    <div class="gradient-orange p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="title-font text-3xl text-white mb-2">USUÁRIOS</h1>
                                <p class="text-orange-100">Gerenciar jogadores da plataforma</p>
                            </div>
                            <button onclick="navigateTo('dashboard')"
                                class="text-white hover:bg-white/20 p-2 rounded-lg transition">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-6 space-y-4">
                        <!-- Info -->
                        <div class="glass-card rounded-xl p-4">
                            <div class="flex items-center justify-between text-sm mb-3">
                                <div class="text-gray-300">
                                    <i class="fas fa-users mr-2 text-orange-400"></i>
                                    Total de usuários: <span class="text-white font-bold">${allUsers.length}</span>
                                </div>
                                <div class="text-gray-300">
                                    <i class="fas fa-user-shield mr-2 text-yellow-400"></i>
                                    Admins: <span class="text-white font-bold">${allUsers.filter(u => u.role === 'admin').length}</span>
                                </div>
                            </div>
                            ${allUsers.filter(u => u.role === 'visitor').length > 0 ? `
                                <div class="border-t border-gray-600 pt-3">
                                    <div class="flex items-center justify-between">
                                        <div class="text-gray-300 text-sm">
                                            <i class="fas fa-user-clock mr-2 text-purple-400"></i>
                                            Visitantes: <span class="text-white font-bold">${allUsers.filter(u => u.role === 'visitor').length}</span>
                                        </div>
                                        <button onclick="manualCleanupAllVisitors()"
                                            class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-xs font-bold transition">
                                            <i class="fas fa-trash mr-1"></i>Limpar Visitantes
                                        </button>
                                    </div>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Lista de Usuários -->
                        ${allUsers.map(user => `
                            <div class="glass-card rounded-xl p-4 ${user.role === 'admin' ? 'border-2 border-yellow-500/50' : ''}">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex items-center space-x-3 flex-1">
                                        <div class="text-3xl">${user.photo}</div>
                                        <div class="flex-1">
                                            <div class="text-white font-bold text-lg">${user.name}</div>
                                            <div class="text-gray-400 text-sm">${user.email}</div>
                                            <div class="flex items-center gap-2 mt-1">
                                                ${user.role === 'admin' ? `
                                                    <span class="bg-yellow-500/20 border border-yellow-500 text-yellow-400 text-xs px-2 py-1 rounded-full">
                                                        <i class="fas fa-crown mr-1"></i>Admin
                                                    </span>
                                                ` : `
                                                    <span class="bg-blue-500/20 border border-blue-500 text-blue-400 text-xs px-2 py-1 rounded-full">
                                                        <i class="fas fa-user mr-1"></i>Jogador
                                                    </span>
                                                `}
                                                ${user.role === 'visitor' ? `
                                                    <span class="bg-purple-500/20 border border-purple-500 text-purple-400 text-xs px-2 py-1 rounded-full">
                                                        <i class="fas fa-user-clock mr-1"></i>Visitante
                                                    </span>
                                                ` : ''}
                                                <span class="${user.paymentType === 'monthly' ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-cyan-500/20 border border-cyan-500 text-cyan-400'} text-xs px-2 py-1 rounded-full">
                                                    <i class="fas ${user.paymentType === 'monthly' ? 'fa-calendar-alt' : 'fa-ticket-alt'} mr-1"></i>${user.paymentType === 'monthly' ? 'Mensalista' : 'Diarista'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="level-badge level-${user.level} ml-2">
                                        ${user.level}
                                    </div>
                                </div>

                                <!-- Stats -->
                                <div class="grid grid-cols-3 gap-2 mb-3 text-center text-sm">
                                    <div class="bg-gray-700/50 rounded-lg p-2">
                                        <div class="text-green-400 font-bold">${user.stats.wins}</div>
                                        <div class="text-gray-400 text-xs">Vitórias</div>
                                    </div>
                                    <div class="bg-gray-700/50 rounded-lg p-2">
                                        <div class="text-red-400 font-bold">${user.stats.losses}</div>
                                        <div class="text-gray-400 text-xs">Derrotas</div>
                                    </div>
                                    <div class="bg-gray-700/50 rounded-lg p-2">
                                        <div class="text-yellow-400 font-bold">${user.stats.championships}</div>
                                        <div class="text-gray-400 text-xs">Títulos</div>
                                    </div>
                                </div>

                                <!-- Botões de Ação -->
                                ${user.id !== AppState.currentUser.id ? `
                                    <div class="space-y-2">
                                        <div class="flex gap-2">
                                            <button onclick="showEditUserModal(${user.id})"
                                                class="btn-secondary flex-1 py-2 rounded-lg text-white text-sm font-bold">
                                                <i class="fas fa-edit mr-1"></i>Nível
                                            </button>
                                            <button onclick="toggleUserRole(${user.id})"
                                                class="btn-primary flex-1 py-2 rounded-lg text-white text-sm font-bold">
                                                <i class="fas fa-exchange-alt mr-1"></i>Perfil
                                            </button>
                                        </div>
                                        <button onclick="togglePaymentType(${user.id})"
                                            class="w-full py-2 rounded-lg text-white text-sm font-bold ${user.paymentType === 'monthly' ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan-600 hover:bg-cyan-700'}">
                                            <i class="fas fa-wallet mr-1"></i>Trocar para ${user.paymentType === 'monthly' ? 'Diarista' : 'Mensalista'}
                                        </button>
                                    </div>
                                ` : `
                                    <div class="space-y-2">
                                        <div class="text-center text-gray-500 text-sm py-2 mb-2">
                                            <i class="fas fa-lock mr-1"></i>Você não pode editar nível e perfil próprios
                                        </div>
                                        <button onclick="togglePaymentType(${user.id})"
                                            class="w-full py-2 rounded-lg text-white text-sm font-bold ${user.paymentType === 'monthly' ? 'bg-green-600 hover:bg-green-700' : 'bg-cyan-600 hover:bg-cyan-700'}">
                                            <i class="fas fa-wallet mr-1"></i>Trocar para ${user.paymentType === 'monthly' ? 'Diarista' : 'Mensalista'}
                                        </button>
                                    </div>
                                `}
                            </div>
                        `).join('')}
                    </div>

                    ${BottomNav('dashboard')}
                </div>
            `;
        }

        // Tela de Controle de Mensalidades (Admin apenas)
        function PaymentsScreen() {
            if (AppState.currentUser?.role !== 'admin') {
                navigateTo('dashboard');
                return '';
            }

            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
            const monthlyUsers = AppState.users.filter(u => u.paymentType === 'monthly');

            const currentFee = AppState.monthlyFees[currentMonth] || 0;
            const perPersonFee = monthlyUsers.length > 0 ? currentFee / monthlyUsers.length : 0;

            // Calcular quantos já pagaram
            const paidCount = monthlyUsers.filter(u => u.monthlyPayments[currentMonth]?.paid).length;
            const pendingCount = monthlyUsers.length - paidCount;

            return `
                <div class="min-h-screen pb-20 animate-fadeIn">
                    <div class="gradient-orange p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="title-font text-3xl text-white mb-2">MENSALIDADES</h1>
                                <p class="text-orange-100">Controle de pagamentos mensais</p>
                            </div>
                            <button onclick="navigateTo('dashboard')"
                                class="text-white hover:bg-white/20 p-2 rounded-lg transition">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Configuração do Valor -->
                        <div class="glass-card rounded-xl p-5">
                            <h3 class="text-white font-bold text-lg mb-4">
                                <i class="fas fa-cog mr-2 text-orange-400"></i>
                                Configuração - ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-white font-medium mb-2">
                                        Valor Total da Mensalidade
                                    </label>
                                    <div class="flex gap-3">
                                        <div class="relative flex-1">
                                            <span class="absolute left-4 top-3 text-gray-400">R$</span>
                                            <input type="number" id="monthly-fee-value"
                                                value="${currentFee}"
                                                min="0"
                                                step="0.01"
                                                class="custom-input w-full pl-12 pr-4 py-3 rounded-lg text-white"
                                                placeholder="0.00">
                                        </div>
                                        <button onclick="saveMouthlyFee()"
                                            class="btn-primary px-6 py-3 rounded-lg text-white font-bold">
                                            <i class="fas fa-save mr-2"></i>Salvar
                                        </button>
                                    </div>
                                </div>

                                <!-- Info Cards -->
                                <div class="grid grid-cols-3 gap-3">
                                    <div class="bg-green-500/20 border border-green-500 rounded-lg p-3 text-center">
                                        <div class="text-2xl font-bold text-green-400">${monthlyUsers.length}</div>
                                        <div class="text-gray-300 text-xs">Mensalistas</div>
                                    </div>
                                    <div class="bg-orange-500/20 border border-orange-500 rounded-lg p-3 text-center">
                                        <div class="text-lg font-bold text-orange-400">R$ ${perPersonFee.toFixed(2)}</div>
                                        <div class="text-gray-300 text-xs">Por Pessoa</div>
                                    </div>
                                    <div class="bg-blue-500/20 border border-blue-500 rounded-lg p-3 text-center">
                                        <div class="text-2xl font-bold text-blue-400">${paidCount}/${monthlyUsers.length}</div>
                                        <div class="text-gray-300 text-xs">Pagaram</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Lista de Mensalistas -->
                        ${monthlyUsers.length > 0 ? `
                            <div class="glass-card rounded-xl p-5">
                                <h3 class="text-white font-bold text-lg mb-4">
                                    <i class="fas fa-users mr-2 text-green-400"></i>
                                    Mensalistas (${monthlyUsers.length})
                                </h3>
                                <div class="space-y-3">
                                    ${monthlyUsers.map(user => {
                                        const hasPaid = user.monthlyPayments[currentMonth]?.paid || false;
                                        return `
                                            <div class="bg-gray-700/50 rounded-lg p-4 ${hasPaid ? 'border-2 border-green-500' : 'border-2 border-gray-600'}">
                                                <div class="flex items-center justify-between mb-3">
                                                    <div class="flex items-center space-x-3 flex-1">
                                                        <div class="text-2xl">${user.photo}</div>
                                                        <div class="flex-1">
                                                            <div class="text-white font-bold">${user.name}</div>
                                                            <div class="text-gray-400 text-sm">${user.email}</div>
                                                        </div>
                                                    </div>
                                                    <div class="text-right">
                                                        <div class="text-xl font-bold ${hasPaid ? 'text-green-400' : 'text-orange-400'}">
                                                            R$ ${perPersonFee.toFixed(2)}
                                                        </div>
                                                        <div class="text-xs ${hasPaid ? 'text-green-400' : 'text-gray-400'}">
                                                            ${hasPaid ? 'PAGO ✓' : 'PENDENTE'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <button onclick="togglePaymentStatus(${user.id}, '${currentMonth}')"
                                                    class="w-full py-2 rounded-lg text-white font-bold ${hasPaid ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}">
                                                    <i class="fas ${hasPaid ? 'fa-times' : 'fa-check'} mr-2"></i>
                                                    ${hasPaid ? 'Marcar como Pendente' : 'Marcar como Pago'}
                                                </button>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        ` : `
                            <div class="glass-card rounded-xl p-8 text-center">
                                <div class="text-6xl mb-4">💰</div>
                                <h3 class="text-white text-xl font-bold mb-2">Nenhum Mensalista</h3>
                                <p class="text-gray-400 mb-6">Não há usuários cadastrados como mensalistas</p>
                                <button onclick="navigateTo('users')"
                                    class="btn-primary px-6 py-3 rounded-lg text-white font-bold">
                                    <i class="fas fa-users mr-2"></i>Gerenciar Usuários
                                </button>
                            </div>
                        `}

                        ${pendingCount > 0 ? `
                            <div class="bg-yellow-500/20 border border-yellow-500 rounded-xl p-4">
                                <div class="flex items-start space-x-3">
                                    <i class="fas fa-exclamation-triangle text-yellow-400 text-xl mt-1"></i>
                                    <div class="flex-1">
                                        <div class="text-yellow-300 font-bold mb-1">Atenção!</div>
                                        <div class="text-yellow-100 text-sm">
                                            ${pendingCount} ${pendingCount === 1 ? 'mensalista ainda não pagou' : 'mensalistas ainda não pagaram'} este mês.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : monthlyUsers.length > 0 ? `
                            <div class="bg-green-500/20 border border-green-500 rounded-xl p-4">
                                <div class="flex items-start space-x-3">
                                    <i class="fas fa-check-circle text-green-400 text-xl mt-1"></i>
                                    <div class="flex-1">
                                        <div class="text-green-300 font-bold mb-1">Tudo Certo!</div>
                                        <div class="text-green-100 text-sm">
                                            Todos os mensalistas já pagaram este mês! 🎉
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>

                    ${BottomNav('dashboard')}
                </div>
            `;
        }

        // Tela de Controle Financeiro (Admin apenas)
        function FinancialControlScreen() {
            if (AppState.currentUser?.role !== 'admin') {
                navigateTo('dashboard');
                return '';
            }

            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            // Obter dados do mês atual
            const monthData = AppState.financialControl[currentMonth] || {
                arenaPaid: 0,
                dailyBox: 0,
                dailyPlayers: []
            };

            // Calcular total arrecadado
            const totalCollected = monthData.arenaPaid + monthData.dailyBox;

            // Obter valor total da mensalidade
            const totalMonthlyFee = AppState.monthlyFees[currentMonth] || 0;

            // Calcular saldo (caixinha - arena paga)
            const balance = monthData.dailyBox;

            return `
                <div class="min-h-screen pb-20 animate-fadeIn">
                    <div class="gradient-orange p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <h1 class="title-font text-3xl text-white mb-2">CONTROLE FINANCEIRO</h1>
                                <p class="text-orange-100">Gestão de receitas e despesas</p>
                            </div>
                            <button onclick="navigateTo('dashboard')"
                                class="text-white hover:bg-white/20 p-2 rounded-lg transition">
                                <i class="fas fa-times text-2xl"></i>
                            </button>
                        </div>
                    </div>

                    <div class="p-6 space-y-6">
                        <!-- Seletor de Mês -->
                        <div class="glass-card rounded-xl p-5">
                            <div class="flex items-center justify-between mb-4">
                                <h3 class="text-white font-bold text-lg">
                                    <i class="fas fa-calendar mr-2 text-orange-400"></i>
                                    ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                </h3>
                            </div>

                            <!-- Cards de Resumo -->
                            <div class="grid grid-cols-2 gap-3 mb-4">
                                <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                                    <div class="text-xs opacity-80 mb-1">Pago para Arena</div>
                                    <div class="text-2xl font-bold">R$ ${monthData.arenaPaid.toFixed(2)}</div>
                                </div>
                                <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
                                    <div class="text-xs opacity-80 mb-1">Caixinha Diaristas</div>
                                    <div class="text-2xl font-bold">R$ ${monthData.dailyBox.toFixed(2)}</div>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 gap-3">
                                <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                                    <div class="text-xs opacity-80 mb-1">Total Arrecadado</div>
                                    <div class="text-2xl font-bold">R$ ${totalCollected.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Detalhamento: Mensalistas -->
                        <div class="glass-card rounded-xl p-5">
                            <h3 class="text-white font-bold text-lg mb-4">
                                <i class="fas fa-building mr-2 text-blue-400"></i>
                                Pagamentos para Arena (Mensalistas)
                            </h3>
                            <div class="bg-blue-500/20 border border-blue-500 rounded-lg p-4 mb-3">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <div class="text-blue-300 text-sm">Valor Total Mensalidade</div>
                                        <div class="text-white text-xl font-bold">R$ ${totalMonthlyFee.toFixed(2)}</div>
                                    </div>
                                    <div>
                                        <div class="text-blue-300 text-sm text-right">Recebido</div>
                                        <div class="text-white text-xl font-bold">R$ ${monthData.arenaPaid.toFixed(2)}</div>
                                    </div>
                                </div>
                                <div class="mt-3 bg-blue-900/30 rounded-full h-2">
                                    <div class="bg-blue-400 h-2 rounded-full transition-all" style="width: ${totalMonthlyFee > 0 ? (monthData.arenaPaid / totalMonthlyFee * 100) : 0}%"></div>
                                </div>
                            </div>
                            <p class="text-gray-400 text-sm">
                                <i class="fas fa-info-circle mr-1"></i>
                                Valores são contabilizados automaticamente quando mensalistas marcam pagamento
                            </p>
                        </div>

                        <!-- Detalhamento: Diaristas -->
                        <div class="glass-card rounded-xl p-5">
                            <h3 class="text-white font-bold text-lg mb-4">
                                <i class="fas fa-piggy-bank mr-2 text-green-400"></i>
                                Caixinha de Diaristas
                            </h3>

                            ${monthData.dailyPlayers && monthData.dailyPlayers.length > 0 ? `
                                <div class="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-3">
                                    <div class="flex items-center justify-between mb-2">
                                        <div class="text-green-300 text-sm">Total em Caixa</div>
                                        <div class="text-white text-2xl font-bold">R$ ${monthData.dailyBox.toFixed(2)}</div>
                                    </div>
                                    <div class="text-green-300 text-xs">
                                        ${monthData.dailyPlayers.length} participação${monthData.dailyPlayers.length > 1 ? 'ões' : ''} × R$ 15,00
                                    </div>
                                </div>

                                <div class="space-y-2 max-h-64 overflow-y-auto hide-scrollbar">
                                    <div class="text-gray-400 text-xs mb-2 font-bold">Histórico de Participações:</div>
                                    ${monthData.dailyPlayers.map(player => `
                                        <div class="bg-gray-700/50 rounded-lg p-3 flex items-center justify-between">
                                            <div>
                                                <div class="text-white font-medium">${player.userName}</div>
                                                <div class="text-gray-400 text-xs">
                                                    ${new Date(player.gameDate).toLocaleDateString('pt-BR')}
                                                </div>
                                            </div>
                                            <div class="text-green-400 font-bold">+ R$ 15,00</div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : `
                                <div class="bg-gray-700/30 rounded-lg p-8 text-center">
                                    <div class="text-4xl mb-3">💰</div>
                                    <div class="text-gray-400">Nenhuma participação de diarista este mês</div>
                                </div>
                            `}

                            <p class="text-gray-400 text-sm mt-3">
                                <i class="fas fa-info-circle mr-1"></i>
                                R$ 15 é adicionado automaticamente quando diarista/visitante participa de um jogo
                            </p>
                        </div>

                        <!-- Informações Adicionais -->
                        <div class="bg-orange-500/20 border border-orange-500 rounded-xl p-4">
                            <div class="flex items-start space-x-3">
                                <i class="fas fa-lightbulb text-orange-400 text-xl mt-1"></i>
                                <div class="flex-1">
                                    <div class="text-orange-300 font-bold mb-1">Como funciona?</div>
                                    <div class="text-orange-100 text-sm space-y-1">
                                        <p>• Quando mensalista paga → valor vai para "Pago para Arena"</p>
                                        <p>• Quando diarista/visitante participa de jogo → R$ 15 vai para "Caixinha"</p>
                                        <p>• Tudo é contabilizado automaticamente por mês</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    ${BottomNav('dashboard')}
                </div>
            `;
        }

        // Navegação Inferior
        function BottomNav(active) {
            const hasActiveMatch = AppState.activeMatch !== null;

            const items = [
                { id: 'dashboard', icon: 'fa-home', label: 'Início' },
                { id: 'games', icon: 'fa-calendar', label: 'Jogos' },
                { id: 'play', icon: 'fa-play-circle', label: 'Play', highlight: hasActiveMatch },
                { id: 'stats', icon: 'fa-chart-bar', label: 'Stats' }
            ];

            return `
                <div class="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700 shadow-2xl">
                    <div class="grid grid-cols-4 gap-1 p-2">
                        ${items.map(item => `
                            <button onclick="navigateTo('${item.id}')"
                                class="relative flex flex-col items-center justify-center py-3 rounded-lg transition ${active === item.id ? 'bg-orange-500 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}">
                                ${item.highlight ? '<div class="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>' : ''}
                                <i class="fas ${item.icon} text-xl mb-1 ${item.highlight ? 'animate-pulse' : ''}"></i>
                                <span class="text-xs font-medium">${item.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // ============================================
        // HANDLERS DE EVENTOS
        // ============================================
        function handleLogin(event) {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            if (login(email, password)) {
                showNotification('Login realizado com sucesso! 🎉', 'success');
            } else {
                showNotification('Email ou senha incorretos', 'error');
            }
        }

        function handleRegister(event) {
            event.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const paymentType = document.querySelector('input[name="payment-type"]:checked').value;

            register(name, email, password, paymentType);
            showNotification('Conta criada com sucesso! 🎉', 'success');
        }

        function handleJoinGame(gameId) {
            if (joinGame(gameId)) {
                showNotification('Você entrou no jogo! 🏐', 'success');
                render();
            } else {
                showNotification('Não foi possível entrar no jogo', 'error');
            }
        }

        function handleLeaveGame(gameId) {
            if (leaveGame(gameId)) {
                showNotification('Você saiu do jogo', 'info');
                render();
            }
        }

        function handleCreateTeams(gameId) {
            const game = AppState.games.find(g => g.id === gameId);
            if (game) {
                // Usar apenas jogadores da lista principal (não suplentes)
                const { mainPlayers } = splitMainAndReserve(game);
                const playerIds = mainPlayers.map(p => p.id);

                createBalancedTeams(playerIds, game.teamSize);
                game.status = 'in_progress';
                AppState.currentGame = game;
                saveState();
                showNotification('Jogo iniciado! Times criados com sucesso! 🎯', 'success');
                navigateTo('play');
            }
        }

        function handleStartMatch() {
            const nextMatch = getNextMatch();
            if (!nextMatch) {
                showNotification('Erro ao criar próxima partida', 'error');
                return;
            }

            AppState.activeMatch = {
                ...nextMatch,
                score1: 0,
                score2: 0,
                maxPoints: AppState.currentGame.pointsPerMatch,
                finished: false,
                gameId: AppState.currentGame.id,
                matchNumber: AppState.matchHistory.length + 1
            };
            saveState();
            navigateTo('match');
            showNotification('Partida iniciada! Boa sorte! 🏐', 'success');
        }

        // Determina qual será a próxima partida baseado no histórico e regras
        function getNextMatch() {
            const numTeams = AppState.teams.length;
            const history = AppState.matchHistory;
            const game = AppState.currentGame;

            // Se não tem histórico, primeiro jogo é Time 1 vs Time 2
            if (history.length === 0) {
                return {
                    team1: AppState.teams[0],
                    team2: AppState.teams[1],
                    team1Index: 0,
                    team2Index: 1
                };
            }

            const lastMatch = history[history.length - 1];
            const winnerIndex = lastMatch.score1 > lastMatch.score2 ? lastMatch.team1Index : lastMatch.team2Index;
            const loserIndex = lastMatch.score1 > lastMatch.score2 ? lastMatch.team2Index : lastMatch.team1Index;

            // 2 TIMES: sempre os mesmos jogam
            if (numTeams === 2) {
                return {
                    team1: AppState.teams[0],
                    team2: AppState.teams[1],
                    team1Index: 0,
                    team2Index: 1
                };
            }

            // 3 TIMES: quem ganha permanece, entra o próximo na fila
            if (numTeams === 3) {
                const nextOpponentIndex = [0, 1, 2].find(i => i !== winnerIndex && i !== loserIndex);
                return {
                    team1: AppState.teams[winnerIndex],
                    team2: AppState.teams[nextOpponentIndex],
                    team1Index: winnerIndex,
                    team2Index: nextOpponentIndex
                };
            }

            // 4 TIMES: regra "ganhou 2 sai" se ativa, senão quem ganha permanece
            if (numTeams === 4) {
                // Verificar se o time vencedor ganhou as últimas 2
                const consecutiveWins = game.twoWinsRule && checkConsecutiveWins(winnerIndex, 2);

                if (consecutiveWins) {
                    // Time ganhou 2 seguidas, sai e os dois de fora entram
                    const outTeams = [0, 1, 2, 3].filter(i =>
                        i !== lastMatch.team1Index && i !== lastMatch.team2Index
                    );
                    return {
                        team1: AppState.teams[outTeams[0]],
                        team2: AppState.teams[outTeams[1]],
                        team1Index: outTeams[0],
                        team2Index: outTeams[1]
                    };
                } else {
                    // Vencedor permanece, perdedor sai e entra um dos que está de fora
                    const outTeams = [0, 1, 2, 3].filter(i =>
                        i !== lastMatch.team1Index && i !== lastMatch.team2Index
                    );
                    // Entra o primeiro time que está de fora
                    return {
                        team1: AppState.teams[winnerIndex],
                        team2: AppState.teams[outTeams[0]],
                        team1Index: winnerIndex,
                        team2Index: outTeams[0]
                    };
                }
            }

            return null;
        }

        // Verifica se um time ganhou N partidas consecutivas
        function checkConsecutiveWins(teamIndex, count) {
            const history = AppState.matchHistory;
            if (history.length < count) return false;

            for (let i = 0; i < count; i++) {
                const match = history[history.length - 1 - i];
                const winnerIdx = match.score1 > match.score2 ? match.team1Index : match.team2Index;
                if (winnerIdx !== teamIndex) return false;
            }
            return true;
        }

        function updateScore(team, delta) {
            const match = AppState.activeMatch;
            if (!match || match.finished) return;

            if (team === 1) {
                match.score1 = Math.max(0, match.score1 + delta);
            } else {
                match.score2 = Math.max(0, match.score2 + delta);
            }

            // Verificar vitória
            if (match.score1 >= match.maxPoints && match.score1 - match.score2 >= 2) {
                match.finished = true;
                finishMatch();
                showNotification(`Time ${match.team1.name} venceu! 🏆`, 'success');
            } else if (match.score2 >= match.maxPoints && match.score2 - match.score1 >= 2) {
                match.finished = true;
                finishMatch();
                showNotification(`Time ${match.team2.name} venceu! 🏆`, 'success');
            }

            saveState();
            render();
        }

        // Salva a partida no histórico
        function finishMatch() {
            const match = AppState.activeMatch;
            if (!match) return;

            // Determinar time vencedor e perdedor
            const winnerTeam = match.score1 > match.score2 ? match.team1 : match.team2;
            const loserTeam = match.score1 > match.score2 ? match.team2 : match.team1;

            // Atualizar estatísticas dos jogadores do time vencedor
            winnerTeam.players.forEach(player => {
                const user = AppState.users.find(u => u.id === player.id);
                if (user) {
                    user.stats.wins = (user.stats.wins || 0) + 1;
                }
            });

            // Atualizar estatísticas dos jogadores do time perdedor
            loserTeam.players.forEach(player => {
                const user = AppState.users.find(u => u.id === player.id);
                if (user) {
                    user.stats.losses = (user.stats.losses || 0) + 1;
                }
            });

            // Adicionar ao histórico
            const matchRecord = {
                matchNumber: match.matchNumber,
                team1: match.team1,
                team2: match.team2,
                team1Index: match.team1Index,
                team2Index: match.team2Index,
                score1: match.score1,
                score2: match.score2,
                winner: match.score1 > match.score2 ? match.team1.name : match.team2.name,
                timestamp: new Date().toISOString()
            };

            AppState.matchHistory.push(matchRecord);

            // Adicionar ao histórico do jogo também
            if (AppState.currentGame) {
                AppState.currentGame.matchHistory = AppState.matchHistory;

                // Atualizar o jogo na lista
                const gameIndex = AppState.games.findIndex(g => g.id === AppState.currentGame.id);
                if (gameIndex !== -1) {
                    AppState.games[gameIndex].matchHistory = AppState.matchHistory;
                }
            }

            saveState();
        }

        function resetMatch() {
            // Criar a próxima partida baseado no histórico
            handleStartMatch();
        }

        function finishGame() {
            const game = AppState.currentGame || AppState.games.find(g => g.id === AppState.activeMatch?.gameId);
            if (game) {
                game.status = 'finished';

                // Calcular vencedor baseado nas vitórias totais
                const teamWins = {};
                AppState.matchHistory.forEach(match => {
                    const winner = match.winner;
                    teamWins[winner] = (teamWins[winner] || 0) + 1;
                });

                // Encontrar o time com mais vitórias
                let maxWins = 0;
                let champion = '';
                let championTeamIndex = -1;

                Object.keys(teamWins).forEach(team => {
                    if (teamWins[team] > maxWins) {
                        maxWins = teamWins[team];
                        champion = team;
                    }
                });

                // Encontrar o índice do time campeão
                if (champion && AppState.teams) {
                    championTeamIndex = AppState.teams.findIndex(t => t.name === champion);

                    // Atualizar estatísticas de campeonatos dos jogadores do time vencedor
                    if (championTeamIndex !== -1) {
                        const championTeam = AppState.teams[championTeamIndex];
                        championTeam.players.forEach(player => {
                            const user = AppState.users.find(u => u.id === player.id);
                            if (user) {
                                user.stats.championships = (user.stats.championships || 0) + 1;
                            }
                        });
                    }
                }

                game.champion = champion || 'Nenhum vencedor';
                game.finalStats = teamWins;

                // Atualizar o jogo na lista
                const gameIndex = AppState.games.findIndex(g => g.id === game.id);
                if (gameIndex !== -1) {
                    AppState.games[gameIndex] = game;
                }
            }

            AppState.activeMatch = null;
            AppState.currentGame = null;
            AppState.teams = [];
            AppState.matchHistory = [];
            saveState();
            showNotification(`Jogo finalizado! 🏆 Campeão: ${game.champion}`, 'success');
            navigateTo('dashboard');
        }

        // ============================================
        // SISTEMA DE AJUDA
        // ============================================
        function showHelpModal() {
            const isAdmin = AppState.currentUser?.role === 'admin';

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto';
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };

            modal.innerHTML = `
                <div class="glass-card rounded-2xl p-6 max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto hide-scrollbar">
                    <!-- Header -->
                    <div class="flex items-center justify-between mb-6">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 gradient-orange rounded-full flex items-center justify-center">
                                <i class="fas fa-question text-white text-xl"></i>
                            </div>
                            <div>
                                <h2 class="text-white font-bold text-2xl">Centro de Ajuda</h2>
                                <p class="text-gray-400 text-sm">
                                    ${isAdmin ? '👨‍💼 Modo Administrador' : '🏐 Modo Jogador'}
                                </p>
                            </div>
                        </div>
                        <button onclick="this.closest('.fixed').remove()"
                            class="text-gray-400 hover:text-white p-2">
                            <i class="fas fa-times text-2xl"></i>
                        </button>
                    </div>

                    ${isAdmin ? AdminHelp() : PlayerHelp()}

                    <!-- Botão Fechar -->
                    <button onclick="this.closest('.fixed').remove()"
                        class="btn-primary w-full py-3 rounded-lg text-white font-bold mt-6">
                        <i class="fas fa-check mr-2"></i>ENTENDI
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function AdminHelp() {
            return `
                <div class="space-y-6">
                    <!-- Suas Permissões -->
                    <div class="bg-green-500/10 border border-green-500 rounded-xl p-4">
                        <h3 class="text-green-400 font-bold text-lg mb-3">
                            <i class="fas fa-crown mr-2"></i>Suas Permissões de Admin
                        </h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span>Criar e gerenciar jogos</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span>Adicionar visitantes sem cadastro</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span>Remover jogadores da lista</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span>Criar times balanceados automaticamente</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span>Controlar placar das partidas</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span>Finalizar jogos</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span>Gerenciar usuários (editar nível, perfil e tipo de pagamento)</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-green-400 mt-1"></i>
                                <span>Controlar mensalidades dos mensalistas</span>
                            </div>
                        </div>
                    </div>

                    <!-- Guia Rápido -->
                    <div>
                        <h3 class="text-white font-bold text-lg mb-3">
                            <i class="fas fa-book mr-2 text-orange-400"></i>
                            Guia Rápido
                        </h3>

                        <!-- Criar Jogo -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">1️⃣ Criar um Jogo</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Na aba <strong>Início</strong>, clique em "CRIAR NOVO JOGO"
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                📅 Defina a data<br>
                                👥 Escolha max. de jogadores (8-32)<br>
                                🏐 Selecione tamanho do time (4 ou 6)<br>
                                🏆 Ative/desative regra "Ganhou 2 Sai"
                            </div>
                        </div>

                        <!-- Gerenciar Participantes -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">2️⃣ Gerenciar Participantes</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Clique no ícone 👁️ do jogo para ver detalhes
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                ➕ <strong>Adicionar Visitante:</strong> Clique em "Visitante" e informe nome e nível<br>
                                ❌ <strong>Remover Jogador:</strong> Clique no X ao lado do nome<br>
                                ⚠️ <strong>Atenção:</strong> Só funciona antes de iniciar o jogo!
                            </div>
                        </div>

                        <!-- Iniciar Jogo -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">3️⃣ Iniciar o Jogo</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Com mínimo 8 jogadores confirmados
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                🎯 Clique em "CRIAR TIMES E INICIAR"<br>
                                ⚙️ Times são criados automaticamente e balanceados<br>
                                🔒 A lista de participantes será bloqueada<br>
                                🏐 Você será levado para a aba <strong>Play</strong>
                            </div>
                        </div>

                        <!-- Controlar Jogo -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">4️⃣ Controlar o Jogo</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Na aba <strong>Play</strong> (bolinha verde quando ativo)
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                ▶️ Clique em "INICIAR PARTIDA" para começar<br>
                                🎮 Clique em "CONTROLAR PLACAR" para editar pontos<br>
                                ➕➖ Use os botões + e - para ajustar placar<br>
                                🔄 Clique em "Nova Partida" após vitória<br>
                                🏁 Clique em "FINALIZAR JOGO" quando terminar
                            </div>
                        </div>

                        <!-- Finalizar -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">5️⃣ Finalizar Jogo</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Quando todas as partidas terminarem
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                🏆 Clique em "FINALIZAR JOGO"<br>
                                ✅ O campeão será registrado<br>
                                📊 O jogo sairá da lista de disponíveis<br>
                                🎉 Resultado aparece em "Últimos Campeões"
                            </div>
                        </div>

                        <!-- Gerenciar Usuários -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">6️⃣ Gerenciar Usuários</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Acesse a gestão de usuários pelo botão <strong>USUÁRIOS</strong> no Início
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                👥 Visualize todos os usuários cadastrados<br>
                                🎯 Edite o nível de habilidade (1-6)<br>
                                👑 Troque perfil entre Admin e Jogador<br>
                                💰 Troque tipo de pagamento (Mensalista/Diarista)<br>
                                📊 Veja estatísticas de cada usuário<br>
                                ⚠️ Você pode editar apenas seu tipo de pagamento
                            </div>
                        </div>

                        <!-- Controlar Mensalidades -->
                        <div class="glass-card rounded-lg p-4">
                            <h4 class="text-orange-400 font-bold mb-2">7️⃣ Controlar Mensalidades</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Acesse pelo botão <strong>MENSALIDADES</strong> no Início
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                💵 <strong>Definir Valor:</strong> Digite o valor total da mensalidade do mês<br>
                                🧮 <strong>Cálculo Automático:</strong> Sistema divide entre os mensalistas<br>
                                ✅ <strong>Marcar Pagamentos:</strong> Clique em "Marcar como Pago" quando receber<br>
                                📊 <strong>Acompanhar:</strong> Veja quantos já pagaram em tempo real<br>
                                📅 <strong>Novo Mês:</strong> Defina novo valor (pode ser diferente)
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function PlayerHelp() {
            return `
                <div class="space-y-6">
                    <!-- Suas Permissões -->
                    <div class="bg-blue-500/10 border border-blue-500 rounded-xl p-4">
                        <h3 class="text-blue-400 font-bold text-lg mb-3">
                            <i class="fas fa-user mr-2"></i>Suas Permissões de Jogador
                        </h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-blue-400 mt-1"></i>
                                <span>Participar de jogos disponíveis</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-blue-400 mt-1"></i>
                                <span>Sair de jogos antes de iniciarem</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-blue-400 mt-1"></i>
                                <span>Ver times formados</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-blue-400 mt-1"></i>
                                <span>Acompanhar placar ao vivo</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-300">
                                <i class="fas fa-check text-blue-400 mt-1"></i>
                                <span>Ver suas estatísticas</span>
                            </div>
                        </div>
                        <div class="mt-3 pt-3 border-t border-gray-700">
                            <div class="flex items-start space-x-2 text-gray-400 text-sm mb-2">
                                <i class="fas fa-times text-red-400 mt-1"></i>
                                <span>Você não pode criar jogos, adicionar visitantes ou controlar placar</span>
                            </div>
                            <div class="flex items-start space-x-2 text-gray-400 text-sm">
                                <i class="fas fa-times text-red-400 mt-1"></i>
                                <span>Você não pode gerenciar usuários ou controlar mensalidades</span>
                            </div>
                        </div>
                    </div>

                    <!-- Guia Rápido -->
                    <div>
                        <h3 class="text-white font-bold text-lg mb-3">
                            <i class="fas fa-book mr-2 text-orange-400"></i>
                            Como Usar o App
                        </h3>

                        <!-- Participar -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">1️⃣ Participar de um Jogo</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Na aba <strong>Início</strong>, veja os jogos disponíveis
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                📅 Escolha o jogo pela data<br>
                                👥 Veja quantas vagas disponíveis<br>
                                ✅ Clique em "PARTICIPAR" para confirmar<br>
                                👁️ Clique no ícone olho para ver todos os participantes
                            </div>
                        </div>

                        <!-- Desistir -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">2️⃣ Desistir de um Jogo</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Só pode sair antes do jogo começar
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                🔴 Clique em "SAIR" no card do jogo<br>
                                ⚠️ <strong>Importante:</strong> Após o jogo iniciar, não é possível sair!
                            </div>
                        </div>

                        <!-- Acompanhar -->
                        <div class="glass-card rounded-lg p-4 mb-3">
                            <h4 class="text-orange-400 font-bold mb-2">3️⃣ Acompanhar o Jogo</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Quando o admin iniciar o jogo
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                🏐 Uma bolinha verde aparecerá na aba <strong>Play</strong><br>
                                👥 Veja os times formados<br>
                                📊 Acompanhe o placar em tempo real<br>
                                🏆 Veja quem está ganhando cada partida
                            </div>
                        </div>

                        <!-- Estatísticas -->
                        <div class="glass-card rounded-lg p-4">
                            <h4 class="text-orange-400 font-bold mb-2">4️⃣ Ver Estatísticas</h4>
                            <p class="text-gray-300 text-sm mb-2">
                                Na aba <strong>Stats</strong>
                            </p>
                            <div class="bg-gray-700/50 rounded p-3 text-sm text-gray-400">
                                🎯 Veja seu nível atual<br>
                                📈 Acompanhe vitórias e derrotas<br>
                                🏆 Veja quantos campeonatos ganhou<br>
                                📊 Compare-se com outros jogadores no ranking
                            </div>
                        </div>
                    </div>

                    <!-- Navegação -->
                    <div class="glass-card rounded-lg p-4">
                        <h4 class="text-white font-bold mb-3">
                            <i class="fas fa-compass mr-2 text-orange-400"></i>
                            Navegação do App
                        </h4>
                        <div class="grid grid-cols-2 gap-3 text-sm">
                            <div class="bg-gray-700/50 rounded p-3">
                                <i class="fas fa-home text-orange-400 mr-2"></i>
                                <strong class="text-white">Início</strong><br>
                                <span class="text-gray-400">Lista de jogos disponíveis</span>
                            </div>
                            <div class="bg-gray-700/50 rounded p-3">
                                <i class="fas fa-calendar text-orange-400 mr-2"></i>
                                <strong class="text-white">Jogos</strong><br>
                                <span class="text-gray-400">Mesma tela do Início</span>
                            </div>
                            <div class="bg-gray-700/50 rounded p-3">
                                <i class="fas fa-play-circle text-orange-400 mr-2"></i>
                                <strong class="text-white">Play</strong><br>
                                <span class="text-gray-400">Jogo em andamento</span>
                            </div>
                            <div class="bg-gray-700/50 rounded p-3">
                                <i class="fas fa-chart-bar text-orange-400 mr-2"></i>
                                <strong class="text-white">Stats</strong><br>
                                <span class="text-gray-400">Suas estatísticas</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        function showCreateGameModal() {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn overflow-y-auto';
            modal.innerHTML = `
                <div class="glass-card rounded-2xl p-6 max-w-md w-full my-8">
                    <h2 class="text-white font-bold text-2xl mb-4">
                        <i class="fas fa-plus-circle mr-2 text-orange-400"></i>
                        Criar Novo Jogo
                    </h2>
                    <form onsubmit="handleCreateGame(event)" class="space-y-4">
                        <div>
                            <label class="block text-white font-medium mb-2">
                                <i class="fas fa-calendar mr-2"></i>Data do Jogo
                            </label>
                            <input type="date" id="game-date" required
                                class="custom-input w-full px-4 py-3 rounded-lg text-white"
                                value="${new Date().toISOString().split('T')[0]}">
                        </div>
                        <div>
                            <label class="block text-white font-medium mb-2">
                                <i class="fas fa-users mr-2"></i>Máximo de Jogadores
                            </label>
                            <input type="number" id="game-max" required min="8" max="32"
                                class="custom-input w-full px-4 py-3 rounded-lg text-white"
                                value="16">
                        </div>
                        <div>
                            <label class="block text-white font-medium mb-2">
                                <i class="fas fa-user-friends mr-2"></i>Jogadores por Time
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <label class="cursor-pointer">
                                    <input type="radio" name="team-size" value="4" class="hidden peer">
                                    <div class="custom-input peer-checked:border-orange-400 peer-checked:bg-orange-500/20 px-4 py-3 rounded-lg text-white text-center font-bold cursor-pointer hover:bg-white/10 transition">
                                        4 Jogadores
                                    </div>
                                </label>
                                <label class="cursor-pointer">
                                    <input type="radio" name="team-size" value="6" checked class="hidden peer">
                                    <div class="custom-input peer-checked:border-orange-400 peer-checked:bg-orange-500/20 px-4 py-3 rounded-lg text-white text-center font-bold cursor-pointer hover:bg-white/10 transition">
                                        6 Jogadores
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label class="block text-white font-medium mb-2">
                                <i class="fas fa-bullseye mr-2"></i>Pontos por Partida
                            </label>
                            <select id="points-per-match" class="custom-input w-full px-4 py-3 rounded-lg text-white">
                                <option value="10">10 pontos</option>
                                <option value="12">12 pontos</option>
                                <option value="15">15 pontos</option>
                                <option value="21">21 pontos</option>
                                <option value="25" selected>25 pontos</option>
                            </select>
                        </div>
                        <div>
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <input type="checkbox" id="two-wins-rule" checked
                                    class="w-5 h-5 rounded border-2 border-gray-600 bg-gray-700 checked:bg-orange-500 checked:border-orange-500 cursor-pointer">
                                <div class="text-white">
                                    <div class="font-medium">
                                        <i class="fas fa-trophy mr-2 text-yellow-400"></i>
                                        Regra "Ganhou 2 Sai"
                                    </div>
                                    <div class="text-sm text-gray-400">Time que vencer 2 partidas sai da quadra</div>
                                    <div class="text-xs text-yellow-400 mt-1">
                                        ⚠️ Só funciona com 4 times completos
                                    </div>
                                </div>
                            </label>
                        </div>
                        <div class="flex gap-3">
                            <button type="button" onclick="this.closest('.fixed').remove()"
                                class="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg text-white font-bold">
                                Cancelar
                            </button>
                            <button type="submit"
                                class="btn-primary flex-1 py-3 rounded-lg text-white font-bold">
                                <i class="fas fa-check mr-2"></i>Criar
                            </button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function handleCreateGame(event) {
            event.preventDefault();
            const date = document.getElementById('game-date').value;
            const maxPlayers = parseInt(document.getElementById('game-max').value);
            const teamSize = parseInt(document.querySelector('input[name="team-size"]:checked').value);
            const pointsPerMatch = parseInt(document.getElementById('points-per-match').value);
            const twoWinsRule = document.getElementById('two-wins-rule').checked;

            createGame(date, maxPlayers, teamSize, twoWinsRule, pointsPerMatch);
            showNotification('Jogo criado com sucesso! 🎉', 'success');
            document.querySelector('.fixed.inset-0').remove();
            render();
        }

        function showAddVisitorModal(gameId) {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn';
            modal.innerHTML = `
                <div class="glass-card rounded-2xl p-6 max-w-md w-full">
                    <h2 class="text-white font-bold text-2xl mb-4">
                        <i class="fas fa-user-plus mr-2 text-orange-400"></i>
                        Adicionar Visitante
                    </h2>
                    <form onsubmit="handleAddVisitor(event, ${gameId})" class="space-y-4">
                        <div>
                            <label class="block text-white font-medium mb-2">
                                <i class="fas fa-user mr-2"></i>Nome do Visitante
                            </label>
                            <input type="text" id="visitor-name" required
                                class="custom-input w-full px-4 py-3 rounded-lg text-white"
                                placeholder="Ex: Carlos Oliveira">
                        </div>
                        <div>
                            <label class="block text-white font-medium mb-2">
                                <i class="fas fa-star mr-2"></i>Nível (1-6)
                            </label>
                            <div class="grid grid-cols-6 gap-2">
                                ${[1, 2, 3, 4, 5, 6].map(level => `
                                    <label class="cursor-pointer">
                                        <input type="radio" name="visitor-level" value="${level}"
                                            ${level === 3 ? 'checked' : ''} class="hidden peer">
                                        <div class="level-badge level-${level} w-full h-12 cursor-pointer
                                            opacity-50 peer-checked:opacity-100 peer-checked:ring-2 peer-checked:ring-orange-400
                                            hover:opacity-75 transition">
                                            ${level}
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button type="button" onclick="this.closest('.fixed').remove()"
                                class="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg text-white font-bold">
                                Cancelar
                            </button>
                            <button type="submit"
                                class="btn-primary flex-1 py-3 rounded-lg text-white font-bold">
                                <i class="fas fa-check mr-2"></i>Adicionar
                            </button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function handleAddVisitor(event, gameId) {
            event.preventDefault();
            const name = document.getElementById('visitor-name').value;
            const level = document.querySelector('input[name="visitor-level"]:checked').value;

            if (addVisitor(gameId, name, level)) {
                showNotification(`Visitante ${name} adicionado! 👤`, 'success');
                document.querySelector('.fixed.inset-0').remove();

                // Atualizar o currentGame para refletir as mudanças
                AppState.currentGame = AppState.games.find(g => g.id === gameId);
                render();
            } else {
                showNotification('Não foi possível adicionar o visitante', 'error');
            }
        }

        function handleRemovePlayer(gameId, playerId) {
            const player = AppState.users.find(u => u.id === playerId);
            if (player && removePlayerFromGame(gameId, playerId)) {
                showNotification(`${player.name} removido do jogo`, 'info');

                // Atualizar o currentGame
                AppState.currentGame = AppState.games.find(g => g.id === gameId);
                render();
            }
        }

        // ============================================
        // FUNÇÕES DE GERENCIAMENTO DE USUÁRIOS
        // ============================================

        function showEditUserModal(userId) {
            const user = AppState.users.find(u => u.id === userId);
            if (!user) return;

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn';
            modal.innerHTML = `
                <div class="glass-card rounded-2xl p-6 max-w-md w-full">
                    <h2 class="text-white font-bold text-2xl mb-4">
                        <i class="fas fa-edit mr-2 text-orange-400"></i>
                        Editar Nível
                    </h2>
                    <div class="mb-4">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="text-3xl">${user.photo}</div>
                            <div>
                                <div class="text-white font-bold text-lg">${user.name}</div>
                                <div class="text-gray-400 text-sm">${user.email}</div>
                            </div>
                        </div>
                    </div>
                    <form onsubmit="handleEditUserLevel(event, ${userId})" class="space-y-4">
                        <div>
                            <label class="block text-white font-medium mb-3">
                                <i class="fas fa-layer-group mr-2"></i>Selecione o Nível
                            </label>
                            <div class="grid grid-cols-3 gap-3">
                                ${[1, 2, 3, 4, 5, 6].map(level => `
                                    <label class="cursor-pointer">
                                        <input type="radio" name="user-level" value="${level}" ${user.level === level ? 'checked' : ''} class="hidden peer">
                                        <div class="level-badge level-${level} !w-full !h-16 !text-2xl peer-checked:ring-4 peer-checked:ring-white transition">
                                            ${level}
                                        </div>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                        <div class="flex gap-3">
                            <button type="button" onclick="this.closest('.fixed').remove()"
                                class="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg text-white font-bold">
                                Cancelar
                            </button>
                            <button type="submit"
                                class="btn-primary flex-1 py-3 rounded-lg text-white font-bold">
                                <i class="fas fa-save mr-2"></i>Salvar
                            </button>
                        </div>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function handleEditUserLevel(event, userId) {
            event.preventDefault();
            const newLevel = parseInt(document.querySelector('input[name="user-level"]:checked').value);
            const user = AppState.users.find(u => u.id === userId);

            if (user) {
                user.level = newLevel;
                saveState();
                showNotification(`Nível de ${user.name} atualizado para ${newLevel}! ✅`, 'success');
                document.querySelector('.fixed.inset-0').remove();
                render();
            }
        }

        function toggleUserRole(userId) {
            const user = AppState.users.find(u => u.id === userId);
            if (!user) return;

            // Criar modal de confirmação customizado
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn';

            const currentRole = user.role === 'admin' ? 'Admin' : 'Jogador';
            const newRole = user.role === 'admin' ? 'Jogador' : 'Admin';
            const newRoleValue = user.role === 'admin' ? 'player' : 'admin';

            modal.innerHTML = `
                <div class="glass-card rounded-2xl p-6 max-w-md w-full">
                    <h2 class="text-white font-bold text-2xl mb-4">
                        <i class="fas fa-exchange-alt mr-2 text-yellow-400"></i>
                        Trocar Perfil
                    </h2>
                    <div class="mb-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="text-3xl">${user.photo}</div>
                            <div>
                                <div class="text-white font-bold text-lg">${user.name}</div>
                                <div class="text-gray-400 text-sm">${user.email}</div>
                            </div>
                        </div>
                        <div class="bg-gray-700/50 rounded-lg p-4">
                            <p class="text-gray-300 text-center mb-2">
                                Perfil atual: <span class="text-white font-bold">${currentRole}</span>
                            </p>
                            <div class="flex items-center justify-center my-3">
                                <i class="fas fa-arrow-down text-orange-400 text-2xl"></i>
                            </div>
                            <p class="text-gray-300 text-center">
                                Novo perfil: <span class="text-white font-bold">${newRole}</span>
                            </p>
                        </div>
                    </div>
                    <p class="text-yellow-300 text-sm mb-4 text-center">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        Tem certeza que deseja alterar o perfil?
                    </p>
                    <div class="flex gap-3">
                        <button onclick="this.closest('.fixed').remove()"
                            class="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg text-white font-bold">
                            Cancelar
                        </button>
                        <button onclick="confirmToggleRole(${userId}, '${newRoleValue}')"
                            class="btn-primary flex-1 py-3 rounded-lg text-white font-bold">
                            <i class="fas fa-check mr-2"></i>Confirmar
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function confirmToggleRole(userId, newRole) {
            const user = AppState.users.find(u => u.id === userId);
            if (user) {
                user.role = newRole;
                saveState();
                const roleName = newRole === 'admin' ? 'Admin' : 'Jogador';
                showNotification(`${user.name} agora é ${roleName}! 🔄`, 'success');
                document.querySelector('.fixed.inset-0').remove();
                render();
            }
        }

        function togglePaymentType(userId) {
            const user = AppState.users.find(u => u.id === userId);
            if (!user) return;

            const currentType = user.paymentType === 'monthly' ? 'Mensalista' : 'Diarista';
            const newType = user.paymentType === 'monthly' ? 'Diarista' : 'Mensalista';
            const newTypeValue = user.paymentType === 'monthly' ? 'daily' : 'monthly';

            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fadeIn';
            modal.innerHTML = `
                <div class="glass-card rounded-2xl p-6 max-w-md w-full">
                    <h2 class="text-white font-bold text-2xl mb-4">
                        <i class="fas fa-wallet mr-2 text-green-400"></i>
                        Trocar Tipo de Pagamento
                    </h2>
                    <div class="mb-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="text-3xl">${user.photo}</div>
                            <div>
                                <div class="text-white font-bold text-lg">${user.name}</div>
                                <div class="text-gray-400 text-sm">${user.email}</div>
                            </div>
                        </div>
                        <div class="bg-gray-700/50 rounded-lg p-4">
                            <p class="text-gray-300 text-center mb-2">
                                Tipo atual: <span class="text-white font-bold">${currentType}</span>
                            </p>
                            <div class="flex items-center justify-center my-3">
                                <i class="fas fa-arrow-down text-green-400 text-2xl"></i>
                            </div>
                            <p class="text-gray-300 text-center">
                                Novo tipo: <span class="text-white font-bold">${newType}</span>
                            </p>
                        </div>
                    </div>
                    <p class="text-yellow-300 text-sm mb-4 text-center">
                        <i class="fas fa-info-circle mr-2"></i>
                        ${newTypeValue === 'monthly' ? 'O usuário será incluído no controle de mensalidades' : 'O usuário será removido do controle de mensalidades'}
                    </p>
                    <div class="flex gap-3">
                        <button onclick="this.closest('.fixed').remove()"
                            class="flex-1 bg-gray-600 hover:bg-gray-700 py-3 rounded-lg text-white font-bold">
                            Cancelar
                        </button>
                        <button onclick="confirmTogglePaymentType(${userId}, '${newTypeValue}')"
                            class="btn-primary flex-1 py-3 rounded-lg text-white font-bold">
                            <i class="fas fa-check mr-2"></i>Confirmar
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        function confirmTogglePaymentType(userId, newType) {
            const user = AppState.users.find(u => u.id === userId);
            if (user) {
                user.paymentType = newType;
                saveState();
                const typeName = newType === 'monthly' ? 'Mensalista' : 'Diarista';
                showNotification(`${user.name} agora é ${typeName}! 💰`, 'success');
                document.querySelector('.fixed.inset-0').remove();
                render();
            }
        }

        // ============================================
        // FUNÇÕES DE CONTROLE DE MENSALIDADES
        // ============================================

        function saveMouthlyFee() {
            const value = parseFloat(document.getElementById('monthly-fee-value').value) || 0;
            const now = new Date();
            const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

            AppState.monthlyFees[currentMonth] = value;
            saveState();

            showNotification(`Mensalidade de R$ ${value.toFixed(2)} salva para ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}! 💰`, 'success');
            render();
        }

        // ============================================
        // FUNÇÕES DE CONTROLE FINANCEIRO
        // ============================================
        function addToArenaPaid(month, amount) {
            if (!AppState.financialControl[month]) {
                AppState.financialControl[month] = {
                    arenaPaid: 0,
                    dailyBox: 0,
                    dailyPlayers: []
                };
            }
            AppState.financialControl[month].arenaPaid += amount;
        }

        function removeFromArenaPaid(month, amount) {
            if (!AppState.financialControl[month]) {
                AppState.financialControl[month] = {
                    arenaPaid: 0,
                    dailyBox: 0,
                    dailyPlayers: []
                };
            }
            AppState.financialControl[month].arenaPaid -= amount;
            if (AppState.financialControl[month].arenaPaid < 0) {
                AppState.financialControl[month].arenaPaid = 0;
            }
        }

        function addToDailyBox(gameDate, userId, userName) {
            // Extrair mês do jogo (formato YYYY-MM)
            const date = new Date(gameDate);
            const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!AppState.financialControl[month]) {
                AppState.financialControl[month] = {
                    arenaPaid: 0,
                    dailyBox: 0,
                    dailyPlayers: []
                };
            }

            // Verificar se já foi contabilizado para evitar duplicação
            const alreadyAdded = AppState.financialControl[month].dailyPlayers.some(
                p => p.userId === userId && p.gameDate === gameDate
            );

            if (!alreadyAdded) {
                AppState.financialControl[month].dailyBox += 15;
                AppState.financialControl[month].dailyPlayers.push({
                    userId,
                    userName,
                    gameDate,
                    amount: 15,
                    timestamp: Date.now()
                });
            }
        }

        function togglePaymentStatus(userId, month) {
            const user = AppState.users.find(u => u.id === userId);
            if (!user) return;

            if (!user.monthlyPayments) {
                user.monthlyPayments = {};
            }

            if (!user.monthlyPayments[month]) {
                user.monthlyPayments[month] = { paid: false };
            }

            const wasPaid = user.monthlyPayments[month].paid;
            user.monthlyPayments[month].paid = !wasPaid;

            // Quando marcar como pago, adicionar à arena
            if (user.monthlyPayments[month].paid) {
                const monthlyUsers = AppState.users.filter(u => u.paymentType === 'monthly');
                const currentFee = AppState.monthlyFees[month] || 0;
                const perPersonFee = monthlyUsers.length > 0 ? currentFee / monthlyUsers.length : 0;
                addToArenaPaid(month, perPersonFee);
            } else {
                // Se desmarcar, remover da arena
                const monthlyUsers = AppState.users.filter(u => u.paymentType === 'monthly');
                const currentFee = AppState.monthlyFees[month] || 0;
                const perPersonFee = monthlyUsers.length > 0 ? currentFee / monthlyUsers.length : 0;
                removeFromArenaPaid(month, perPersonFee);
            }

            saveState();

            const status = user.monthlyPayments[month].paid ? 'PAGO ✓' : 'PENDENTE';
            showNotification(`${user.name} - ${status}`, user.monthlyPayments[month].paid ? 'success' : 'info');
            render();
        }

        // Sistema de Notificações
        function showNotification(message, type = 'info') {
            const colors = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                info: 'bg-blue-500'
            };

            const notification = document.createElement('div');
            notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slideIn`;
            notification.innerHTML = `
                <div class="flex items-center space-x-2">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // ============================================
        // RENDERIZAÇÃO
        // ============================================
        function render() {
            const app = document.getElementById('app');

            // Verificar autenticação (exceto para login e register)
            if (!AppState.currentUser && AppState.currentView !== 'login' && AppState.currentView !== 'register') {
                AppState.currentView = 'login';
            }

            let content = '';

            switch (AppState.currentView) {
                case 'login':
                    content = LoginScreen();
                    break;
                case 'register':
                    content = RegisterScreen();
                    break;
                case 'dashboard':
                    content = DashboardScreen();
                    break;
                case 'game-detail':
                    content = GameDetailScreen();
                    break;
                case 'games':
                    content = DashboardScreen();
                    break;
                case 'teams':
                    content = TeamsScreen();
                    break;
                case 'play':
                    content = PlayScreen();
                    break;
                case 'match':
                    content = MatchScreen();
                    break;
                case 'stats':
                    content = StatsScreen();
                    break;
                case 'users':
                    content = UsersScreen();
                    break;
                case 'payments':
                    content = PaymentsScreen();
                    break;
                case 'financial':
                    content = FinancialControlScreen();
                    break;
                default:
                    content = LoginScreen();
            }

            app.innerHTML = content;

            // Remover botões de ajuda existentes
            document.querySelectorAll('.help-button').forEach(btn => btn.remove());

            // Adicionar botão de ajuda (exceto em login/register)
            if (AppState.currentUser && AppState.currentView !== 'login' && AppState.currentView !== 'register') {
                const helpButton = document.createElement('div');
                helpButton.className = 'help-button';
                helpButton.onclick = showHelpModal;
                helpButton.innerHTML = '<i class="fas fa-question text-white text-2xl"></i>';
                document.body.appendChild(helpButton);
            }
        }

        // Inicializar aplicação
        document.addEventListener('DOMContentLoaded', () => {
            // Carregar estado dos cookies
            loadState();

            // Se tiver usuário logado, vai para dashboard
            if (AppState.currentUser) {
                AppState.currentView = 'dashboard';
            }

            render();
        });

        // Detectar modo escuro
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('dark');
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
            if (event.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        });
    </script>
</body>
</html>
