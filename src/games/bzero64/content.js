// TODO(conteúdo): Rafael revisa os nomes e as falas
//
// Textos do B-Zero 64: pilotos (nome, tag, cores, descrição) e as falas que
// aparecem no rodapé durante a corrida. Ficam separados da lógica (index.js)
// para dar para trocar o conteúdo sem mexer no jogo.
//
// O primeiro piloto é sempre o jogador: o nome e a foto vêm de quem chama
// startGame({ player }), por isso `nome` fica null aqui.
// Os rivais são fictícios e não têm imagem: o avatar é desenhado em CSS com as
// iniciais (`sigla`) e a cor do piloto.

export const PILOTOS = [
    {
        id: 'player',
        nome: null, // vem de player.name
        tag: 'B-01',
        sub: 'Piloto Alfa · Equilíbrio · Precision Drive',
        lore: 'Equilibrado em tudo. Vence quem erra menos nas curvas.',
        cor: 0x1144cc, hex: '#4488ff',
        sigla: null,
    },
    {
        id: 'nitro',
        nome: 'NITRO', tag: 'N-77',
        sub: 'Piloto Delta · Motor Overclocked · Full Throttle',
        lore: 'Nasceu numa oficina de propulsores ilegais. Freios são opcionais.',
        cor: 0xdd2200, hex: '#ff4422',
        sigla: 'NI',
    },
    {
        id: 'cipher',
        nome: 'CIPHER', tag: 'C-33',
        sub: 'Piloto Gama · IA Embarcada · Rota Calculada',
        lore: 'Cada curva foi simulada 10 mil vezes antes da largada.',
        cor: 0x00bb44, hex: '#33ff77',
        sigla: 'CI',
    },
    {
        id: 'vega',
        nome: 'VEGA', tag: 'V-09',
        sub: 'Piloto Omega · Campo de Força · Guerreira da Órbita',
        lore: 'Veterana das corridas lunares. Destruiu mais naves do que completou voltas.',
        cor: 0xcc8800, hex: '#ffcc22',
        sigla: 'VE',
    },
];

// Falas por piloto (chave = id) e por momento da corrida.
// Só aparecem as falas do piloto que o jogador escolheu.
export const DIALOGOS = {
    player: {
        largada:   ['Sistemas online. Hora de acelerar.', 'Foco na pista, mão no acelerador.', 'Que vença o melhor piloto.'],
        volta2:    ['Segunda volta. Ajustando a estratégia.', 'Já conheço a pista. Agora é pra valer.'],
        meteoros:  ['Meteoros na pista! Atenção total.', 'Chuva de pedras? Só mais um obstáculo.'],
        destruiuIA:['Oponente fora. Próximo!', 'Um a menos no caminho.'],
        vidaBaixa: ['Escudo crítico! Preciso tomar cuidado.', 'Integridade em risco. Hora de desviar.'],
        vitoria:   ['Bandeirada! Corrida vencida.', 'Primeiro lugar. Valeu cada curva.'],
        derrota:   ['Nave destruída... revanche já!', 'Dessa vez não deu. Próxima corrida é minha.'],
    },
    nitro: {
        largada:   ['FREIOS SÃO OPCIONAIS, BEBÊ!', 'Que comecem os fogos!', 'Velocidade máxima, zero arrependimento!'],
        volta2:    ['Só aquecendo os motores!', 'Segunda volta? Tô só começando!'],
        meteoros:  ['Meteoros?! ÓTIMO, mais coisa pra destruir!', 'HA! Isso é o que eu chamo de dificuldade!'],
        destruiuIA:['MAIS UMA ELIMINADA! Quem é o próximo?!', 'Kaboom! Essa não volta mais!'],
        vidaBaixa: ['Dói? NEM LIGO! Continua!', 'Só um arranhão — avança!'],
        vitoria:   ['ISSO É O QUE SE CHAMA DE CORRIDA!', 'VITÓRIA! Alguém ainda duvida de mim?!'],
        derrota:   ['Eita... mas foi divertido DEMAIS.', 'Tudo bem. Revanche. Agora.'],
    },
    cipher: {
        largada:   ['Simulação iniciada. Probabilidade de vitória: 73,4%.', 'Todas as rotas foram calculadas. Executando.', 'Processamento em curso. Adversários detectados.'],
        volta2:    ['Ajuste de trajetória: 0,0012 grau. Executando.', 'Dados suficientes coletados. Otimizando.'],
        meteoros:  ['Meteoros calculados. Desvio automático ativado.', 'Padrão de impacto previsto. Rota ajustada.'],
        destruiuIA:['Análise: oponente eliminado. Eficiência: 94%.', 'Registro atualizado. Competição reduzida.'],
        vidaBaixa: ['Aviso de integridade. Recalculando risco.', 'Dano acima do esperado. Revisando parâmetros.'],
        vitoria:   ['Resultado dentro das projeções. Eficiência máxima.', 'Vitória confirmada. A probabilidade era de 73,4%.'],
        derrota:   ['Erro não previsto. Atualizando modelo preditivo.', 'Derrota registrada. Retreinamento necessário.'],
    },
    vega: {
        largada:   ['Já corri em crateras lunares. Isso aqui é passeio.', 'Preparados? Porque eu não espero.', 'Mais uma corrida. Mais um troféu pra coleção.'],
        volta2:    ['Veterana não cansa. Só acelera.', 'Na Lua não tinha atalho. Aqui também não.'],
        meteoros:  ['Meteoros? Que saudade de casa.', 'Já sobrevivi a coisa pior no espaço. Isso é brincadeira.'],
        destruiuIA:['Mais uma pro meu histórico.', 'Devia ter ficado na garagem.'],
        vidaBaixa: ['Já levei pancada pior. Sigo.', 'Dano absorvido. Sem drama.'],
        vitoria:   ['Disseram que eu estava velha demais. Olha o resultado.', 'Veteranas não se aposentam — dominam.'],
        derrota:   ['Interessante. Não esperava por essa.', 'Raro acontecer. Mas aconteceu. Aprendi.'],
    },
};
