/** Catálogo da Movvi. Preços em reais. `image` fica vazio até receber as fotos do fornecedor. */

export type CategoryId = "pes-pernas" | "quadril-coluna" | "maos-bracos" | "cuidados" | "exercicios" | "led-terapia";

export const CATEGORIES: { id: CategoryId; name: string; short: string }[] = [
  { id: "pes-pernas", name: "Saúde dos Pés e Pernas", short: "Pés e Pernas" },
  { id: "quadril-coluna", name: "Saúde do Quadril e Coluna", short: "Quadril e Coluna" },
  { id: "maos-bracos", name: "Saúde das Mãos e Braços", short: "Mãos e Braços" },
  { id: "cuidados", name: "Cuidados", short: "Cuidados" },
  { id: "exercicios", name: "Exercícios", short: "Exercícios" },
  { id: "led-terapia", name: "LED Terapia", short: "LED Terapia" },
];

export type Product = {
  slug: string;
  name: string;
  categories: [CategoryId, ...CategoryId[]];
  price: number;
  compareAt?: number;
  bullets: [string, string, string];
  image?: string;
  featured?: boolean;
};

type Row = [slug: string, name: string, cats: [CategoryId, ...CategoryId[]], price: number, compareAt: number | null, bullets: [string, string, string], featured?: boolean];

const ROWS: Row[] = [
  // Pés e pernas
  ["massageador-termico-joelho-4-em-1", "Massageador Térmico para Joelho 4 em 1", ["pes-pernas"], 479, 1000, ["Compressão, vibração, aquecimento e luz vermelha em um só aparelho", "Sessões de 15 minutos com desligamento automático", "Sem fio, recarregável por USB"], true],
  ["massageador-compressao-pernas", "Massageador de Compressão para Pernas", ["pes-pernas"], 397, 600, ["Compressão de ar que massageia da panturrilha ao pé", "Ajuda a aliviar a sensação de pernas cansadas e inchadas", "3 intensidades e modo de aquecimento"], true],
  ["massageador-compressao-pernas-360", "Massageador de Compressão para Pernas 360°", ["pes-pernas"], 975, 1200, ["Câmaras de ar que envolvem a perna inteira", "Programas automáticos para relaxar depois do dia", "Controle simples com tela e timer"]],
  ["massageador-termico-pes", "Massageador Térmico para Pés e Tornozelos", ["pes-pernas"], 247, 500, ["Aquecimento e vibração para pés e tornozelos", "Material respirável e ajuste com velcro", "Recarregável, para usar no sofá ou na cama"], true],
  ["terapia-completa-pes-tornozelos", "Terapia Completa para Pés e Tornozelos", ["pes-pernas"], 890, 1000, ["Massagem por compressão, rolos e calor", "Envolve pé e tornozelo ao mesmo tempo", "Vários níveis de intensidade"]],
  ["kit-massageador-pes", "Kit Massageador para Pés", ["pes-pernas"], 297, null, ["Acessórios para massagear sola e calcanhar", "Ajuda a relaxar a fáscia plantar", "Ideal para usar depois de longos períodos em pé"]],
  ["compressa-quente-fria-pes", "Compressa Quente e Fria para Pés", ["pes-pernas"], 597, 750, ["Alterna terapia quente e fria", "Ajuste firme no pé e calcanhar", "Ótima para o fim do dia ou após atividades"]],
  ["meia-noturna-fascite", "Meia Ortopédica Noturna para Fascite Plantar", ["pes-pernas"], 247, 300, ["Mantém o pé em leve alongamento durante o sono", "Tecido macio e confortável para dormir", "Disponível em 3 tamanhos"]],
  ["alongador-de-pe", "Alongador de Pé para Fascite e Calcanhar", ["pes-pernas"], 147, 200, ["Auxilia exercícios de alongamento da sola do pé", "Uso simples em casa, poucos minutos por dia", "Leve e fácil de guardar"]],
  ["palmilha-gel-silicone", "Palmilha Ortopédica em Gel de Silicone", ["pes-pernas"], 67, 130, ["Amortece o impacto a cada passo", "Gel de silicone que se adapta ao calçado", "3 tamanhos disponíveis"]],
  ["palmilha-ultragel", "Palmilha Ortopédica UltraGel", ["pes-pernas"], 197, 250, ["Suporte para o arco do pé e calcanhar", "Camada extra de gel para conforto o dia todo", "Pode ser recortada para o seu calçado"]],
  ["palmilha-ortopedica", "Palmilha Ortopédica de Conforto", ["pes-pernas"], 97, null, ["Distribui melhor o peso do corpo", "Ajuda a reduzir pontos de pressão e calos", "Material lavável"]],
  ["meia-compressao-anti-dor", "Meia de Compressão para Pés", ["pes-pernas"], 127, null, ["Compressão leve no arco e no tornozelo", "Tecido respirável para usar o dia todo", "Vários tamanhos e cores"]],
  ["meia-compressao-ziper", "Meia de Compressão com Zíper", ["pes-pernas"], 147, 150, ["Zíper lateral que facilita vestir e tirar", "Compressão graduada na panturrilha", "6 opções de tamanho"]],
  ["faixa-compressao-pernas", "Faixa de Compressão para Pernas", ["pes-pernas"], 197, 250, ["Compressão ajustável para panturrilha", "Ajuda na sensação de pernas pesadas", "Fecho em velcro, fácil de colocar"]],
  ["compressao-tornozelo", "Compressão para Tornozelo", ["pes-pernas"], 147, 200, ["Estabilidade e conforto para o tornozelo", "Tecido elástico que não marca", "Pode ser usada com tênis"]],
  ["tornozeleira-ortopedica", "Tornozeleira Ortopédica", ["pes-pernas"], 179, null, ["Suporte firme com ajuste em velcro", "Para caminhadas e atividades do dia a dia", "3 tamanhos"]],
  ["tala-joanetes", "Tala Ortopédica para Joanetes", ["pes-pernas"], 127, null, ["Mantém o dedão alinhado durante o uso", "Proteção macia contra atrito", "Para usar em casa ou à noite"]],
  ["corretor-joanetes", "Corretor de Joanetes para Dedos Sobrepostos", ["pes-pernas"], 97, null, ["Separa e alinha os dedos", "Silicone macio e lavável", "Discreto dentro do calçado"]],
  ["chinelo-acupressao", "Chinelo Terapêutico de Acupressão", ["pes-pernas"], 497, 600, ["Pontos em relevo que massageiam a sola", "Solado antiderrapante", "4 tamanhos"]],
  ["sandalia-exercicio-circulacao", "Sandália de Exercício para Circulação", ["pes-pernas"], 287, 350, ["Formato que estimula o movimento da panturrilha", "Uso em casa por curtos períodos", "8 tamanhos"]],
  ["almofada-ortopedica-pernas", "Almofada Ortopédica para Pernas", ["pes-pernas", "quadril-coluna"], 147, 200, ["Mantém joelhos e quadril alinhados ao dormir de lado", "Espuma que se adapta ao corpo", "Capa removível e lavável"]],
  ["massageador-drenagem", "Massageador para Drenagem Linfática", ["pes-pernas", "cuidados"], 197, 250, ["Movimentos que acompanham a massagem de drenagem", "Ajuda na sensação de inchaço", "Leve e recarregável"]],
  ["cinta-circulacao", "Cinta Ortopédica para Circulação", ["pes-pernas"], 227, 300, ["Compressão para coxas e quadril", "Tecido confortável para o dia a dia", "8 tamanhos"]],
  ["creme-castanha-india-kit-3", "Creme de Castanha-da-Índia 240 g (Kit com 3)", ["pes-pernas", "cuidados"], 85.9, 120, ["Creme para massagem nas pernas", "Sensação refrescante após o uso", "Kit com 3 unidades de 240 g"]],
  ["estabilizador-joelho-articulado", "Estabilizador de Joelho Articulado", ["pes-pernas"], 990, 1500, ["Hastes articuladas que acompanham o movimento", "Ajuste de ângulo para mais estabilidade", "Fechos ajustáveis em velcro"]],
  ["compressa-quente-fria-joelho", "Compressa Quente e Fria para Joelho", ["pes-pernas"], 497, 600, ["Terapia quente e fria no mesmo aparelho", "Envolve todo o joelho", "Controle de temperatura simples"]],
  ["joelheira-ortopedica", "Joelheira Ortopédica", ["pes-pernas"], 375, 500, ["Suporte lateral e reforço na patela", "Para caminhadas e tarefas do dia", "6 tamanhos"]],
  ["joelheira-compressao", "Joelheira de Compressão para o Dia a Dia", ["pes-pernas"], 69, null, ["Compressão leve e confortável", "Discreta por baixo da roupa", "2 tamanhos"]],
  ["suporte-joelhos", "Suporte Ortopédico para Joelhos", ["pes-pernas"], 297, 400, ["Apoio para a patela durante o movimento", "Ajuste firme com velcro", "Tecido respirável"]],
  ["compressa-gelo", "Compressa para Gelo", ["pes-pernas", "cuidados"], 147, 200, ["Bolsa reutilizável para gelo ou água quente", "Faixa elástica para prender no local", "Serve para joelho, ombro e tornozelo"]],

  // Quadril e coluna
  ["massageador-coluna-lombar", "Massageador para Coluna Lombar", ["quadril-coluna"], 197, 250, ["Aquecimento e vibração na região lombar", "Cinta ajustável à cintura", "Recarregável"]],
  ["cinta-lombar-descompressao", "Cinta Lombar de Descompressão", ["quadril-coluna"], 527, 750, ["Câmaras de ar que dão apoio à lombar", "Infla com bomba manual", "Discreta por baixo da roupa"]],
  ["cinta-lombar-aquecimento", "Cinta Lombar com Massagem e Aquecimento", ["quadril-coluna"], 850, 1000, ["Massagem e calor para relaxar a lombar", "3 níveis de temperatura", "Sem fio durante o uso"]],
  ["cinta-quadril-coluna", "Cinta Ortopédica para Quadril e Coluna", ["quadril-coluna"], 297, 400, ["Apoio para quadril e região lombar", "Ajuste duplo em velcro", "4 tamanhos"]],
  ["terapia-coluna-cervical", "Massageador para Coluna Cervical", ["quadril-coluna"], 247, 300, ["Massagem e calor no pescoço", "Formato que apoia nos ombros", "Mãos livres durante o uso"]],
  ["descompressor-cervical", "Descompressor Cervical", ["quadril-coluna"], 197, 270, ["Apoio que alonga suavemente o pescoço", "Uso deitado por poucos minutos", "Leve e portátil"]],
  ["alongador-cervical", "Alongador Cervical Ortopédico", ["quadril-coluna"], 147, 200, ["Curvatura que acompanha a coluna cervical", "Material firme e confortável", "Para usar em casa"]],
  ["travesseiro-alongador", "Travesseiro Alongador Cervical e Coluna", ["quadril-coluna"], 197, null, ["Apoia pescoço e parte alta das costas", "Ajuda a relaxar após o dia", "Fácil de limpar"]],
  ["travesseiro-cervical", "Travesseiro Ortopédico Cervical", ["quadril-coluna"], 278, 320, ["Formato anatômico para o pescoço", "Espuma de densidade média", "Capa removível"]],
  ["almofada-cervical", "Almofada Ortopédica Cervical", ["quadril-coluna"], 297, 400, ["Apoio para pescoço em viagens e no sofá", "Espuma que se adapta ao corpo", "Capa lavável"]],
  ["almofada-assento-gel", "Almofada de Assento em Gel", ["quadril-coluna"], 497, 600, ["Gel que distribui o peso ao sentar", "Para cadeira de escritório, carro ou cadeira de rodas", "Capa antiderrapante"]],
  ["colete-postural", "Colete Postural Ortopédico", ["quadril-coluna"], 147, 200, ["Lembra os ombros de ficarem para trás", "Ajuste fácil nas costas", "5 tamanhos"]],
  ["top-postural", "Top Postural", ["quadril-coluna"], 327, 400, ["Sutiã com suporte para postura", "Tecido confortável para o dia todo", "Vários tamanhos e cores"]],
  ["assento-massageador", "Assento Massageador Corporal", ["quadril-coluna", "cuidados"], 497, 750, ["Massagem nas costas e quadril em qualquer cadeira", "Programas automáticos e aquecimento", "Controle com fio"]],

  // Mãos e braços
  ["massageador-termico-3-em-1", "Massageador Térmico 3 em 1 (Joelho, Ombro e Cotovelo)", ["maos-bracos", "pes-pernas"], 247, 500, ["Um aparelho para joelho, ombro ou cotovelo", "Vibração e aquecimento ajustáveis", "Sem fio, recarregável"], true],
  ["luva-reabilitacao-mao", "Luva Robótica de Reabilitação para Mão", ["maos-bracos"], 997, 1000, ["Movimenta os dedos para exercícios de abrir e fechar", "Modos de espelho e treino", "Mão direita ou esquerda, vários tamanhos"]],
  ["orteses-dedos-maos", "Órtese Dinâmica para Dedos e Mãos", ["maos-bracos"], 697, 800, ["Ajuda a manter os dedos estendidos", "Molas ajustáveis", "Para uso orientado por profissional"]],
  ["massageador-punhos-maos", "Massageador para Punhos e Mãos", ["maos-bracos"], 997, null, ["Compressão de ar e calor nas mãos", "Programas automáticos", "2 modelos"]],
  ["compressa-quente-maos", "Compressa Quente para Punhos e Mãos", ["maos-bracos"], 297, 400, ["Aquecimento suave para mãos e punhos", "Luva com ajuste confortável", "Recarregável"]],
  ["cinta-aquecimento-articulacoes", "Cinta de Aquecimento para Tornozelos, Punhos e Braços", ["maos-bracos", "pes-pernas"], 397, 500, ["Aquecimento que se ajusta a várias articulações", "Faixa flexível com velcro", "3 níveis de temperatura"]],
  ["tala-compressao-punhos", "Tala de Compressão para Punhos e Mãos", ["maos-bracos"], 197, null, ["Apoio para o punho em tarefas repetitivas", "Tecido respirável", "2 tamanhos"]],
  ["luva-compressao", "Luva de Compressão para Mãos", ["maos-bracos"], 147, null, ["Compressão leve com pontas abertas", "Permite digitar e usar o celular", "4 tamanhos"]],
  ["cotoveleira-ortopedica", "Cotoveleira Ortopédica", ["maos-bracos"], 127, 197, ["Apoio para o antebraço e cotovelo", "Ajuste com velcro", "2 tamanhos"]],
  ["kit-exercicios-maos", "Kit de Exercícios para Mãos 3 em 1", ["maos-bracos", "exercicios"], 297, 400, ["Exercitadores de força e abertura dos dedos", "Três níveis de resistência", "Para usar em qualquer lugar"]],
  ["fita-exercicio-dedos", "Fita de Exercício para Dedos (3 unidades)", ["maos-bracos", "exercicios"], 97, null, ["Elásticos para exercitar a abertura dos dedos", "Três resistências diferentes", "Silicone durável"]],

  // Cuidados
  ["almofada-giratoria-acamados", "Almofada Giratória para Acamados", ["cuidados"], 297, 350, ["Facilita girar a pessoa na cama ou ao sair do carro", "Menos esforço para o cuidador", "Superfície fácil de limpar"]],
  ["cinta-transferencia", "Cinta de Transferência para Cuidadores", ["cuidados"], 247, null, ["Alças que ajudam a levantar e transferir com segurança", "Distribui o esforço de quem cuida", "Tecido resistente"]],
  ["limpador-higienico", "Limpador Higiênico com Cabo Longo", ["cuidados"], 117, null, ["Ajuda na higiene íntima com mais autonomia", "Cabo longo e pegada firme", "Fácil de lavar"]],
  ["calcador-meias", "Calçador de Meias", ["cuidados"], 147, null, ["Coloque meias sem precisar se abaixar", "Cordas com pegadores", "Ideal para quem tem pouca mobilidade"]],
  ["aplicador-creme-costas", "Aplicador de Creme para as Costas", ["cuidados"], 167, 200, ["Alcança toda a extensão das costas", "Rolos que massageiam enquanto aplicam", "Cabo dobrável"]],
  ["porta-pilula-alarme", "Porta-Comprimidos com Alarme", ["cuidados"], 137, 180, ["Alarmes para não esquecer o horário dos remédios", "Compartimentos separados", "Tamanho de bolso"]],
  ["desencravador-unhas", "Kit Desencravador de Unhas", ["cuidados"], 97, null, ["Ferramentas em aço inox", "Para cuidar das unhas dos pés em casa", "Estojo para guardar"]],
  ["formula-unhas", "Fórmula para Unhas — Força e Cuidado", ["cuidados"], 97, 150, ["Cuidado diário para unhas mais bonitas", "Aplicação simples com pincel", "Frasco para várias semanas"]],
  ["escova-dentes-360", "Escova de Dentes Elétrica 360°", ["cuidados"], 267, null, ["Cerdas em formato de U que limpam todos os dentes", "Indicada para quem tem dificuldade de escovar", "Recarregável"]],
  ["escova-massageadora-cabelo", "Escova Massageadora para Couro Cabeludo", ["cuidados"], 97, 130, ["Cerdas de silicone que massageiam o couro cabeludo", "Usada no banho com o shampoo", "Pegada confortável"]],
  ["massageador-olhos", "Massageador Térmico para Olhos", ["cuidados"], 497, 700, ["Calor e massagem suave ao redor dos olhos", "Som relaxante e timer", "Dobrável para viagem"]],
  ["massageador-anti-estresse", "Massageador para Cabeça Anti-Estresse", ["cuidados"], 347, 500, ["Massagem e calor na cabeça", "Ajuda a relaxar depois de um dia cansativo", "Recarregável"]],
  ["massageador-ortopedico", "Massageador Ortopédico de Mão", ["cuidados"], 547, 1000, ["Ponteiras para diferentes partes do corpo", "Várias velocidades", "Uso em casa"]],
  ["massageador-pistola", "Massageador Muscular Tipo Pistola (20 velocidades)", ["cuidados", "exercicios"], 997, 1200, ["Tela de LED com 20 níveis", "Ponteiras intercambiáveis", "Bateria de longa duração"]],
  ["massageador-corporal", "Massageador Corporal", ["cuidados"], 147, 200, ["Massagem para costas, pernas e braços", "Leve e fácil de usar", "Recarregável"]],
  ["massageador-corporal-desinchar", "Massageador Corporal para Dores e Inchaço", ["cuidados"], 97, null, ["Rolos que massageiam e relaxam", "4 modelos", "Sem fio"]],
  ["terapia-3-em-1-desinchaco", "Massageador 3 em 1 com Ventosa", ["cuidados"], 179, 497, ["Ventosa, raspagem e calor no mesmo aparelho", "Vários níveis de sucção", "Recarregável"]],
  ["ventosaterapia-eletrica", "Ventosaterapia Elétrica", ["cuidados"], 247, null, ["Ventosa elétrica para massagem muscular", "Ajuste de sucção e calor", "3 modelos"]],
  ["aparelho-tens", "Aparelho TENS Portátil", ["cuidados"], 550, 650, ["Eletroestimulação com vários programas", "Eletrodos inclusos", "Uso conforme orientação profissional"]],
  ["pomada-massagem", "Pomada de Massagem Alívio Muscular (Leve 3, Pague 2)", ["cuidados"], 89.9, 147, ["Para massagear músculos e articulações", "Sensação de calor e frescor", "Kit com 3 unidades"]],

  // Exercícios
  ["mini-bike-ergometrica", "Mini Bike Ergométrica", ["exercicios"], 397, 500, ["Pedale sentado para braços ou pernas", "Resistência ajustável", "Visor com tempo e contagem"]],
  ["exercitador-pernas", "Exercitador de Pernas e Coxas", ["exercicios"], 197, 300, ["Fortalece coxas e quadril em casa", "Resistência por mola", "5 opções"]],
  ["exercitador-pernas-pro", "Exercitador de Pernas Pro", ["exercicios"], 297, null, ["Exercícios de abrir e fechar as pernas", "Base firme e acolchoada", "Ideal para treinos curtos"]],
  ["faixa-exercicios", "Faixa de Exercícios e Alongamento", ["exercicios"], 197, 250, ["Laços que facilitam o alongamento", "Ajuda em yoga e reabilitação", "Material resistente"]],
  ["faixa-elastica", "Faixa Elástica para Exercícios em Casa", ["exercicios"], 79, null, ["Treinos de força com pouco espaço", "2 níveis de resistência", "Leve para levar na bolsa"]],
  ["elastico-fortalecimento", "Elástico para Fortalecimento Corporal", ["exercicios"], 197, 250, ["Treino de braços, pernas e costas", "Pegadores confortáveis", "Acompanha guia de exercícios"]],
  ["cinta-alongamento", "Cinta de Alongamento", ["exercicios"], 147, null, ["Alongamento de pernas e pés com apoio", "Várias alças de pegada", "Para iniciantes"]],
  ["halter-agua", "Halter com Água", ["exercicios"], 197, 250, ["Ajuste o peso com mais ou menos água", "Seguro para treinar em casa", "3 tamanhos"]],
  ["bola-exercicio-25cm", "Bola de Exercício e Yoga 25 cm", ["exercicios"], 97, null, ["Para exercícios de equilíbrio e fortalecimento", "Material antiderrapante", "4 cores"]],
  ["roda-abdominal", "Roda Abdominal com Apoio", ["exercicios"], 697, 800, ["Fortalecimento do abdômen e do core", "Apoio para cotovelos", "Base estável"]],

  // LED terapia
  ["manta-led-terapia", "Manta de LED Terapia", ["led-terapia"], 430, 600, ["Luz vermelha e infravermelha em uma manta flexível", "Envolve costas, joelhos ou ombros", "Timer de sessão"]],
  ["led-terapia-pes", "LED Terapia para Pés", ["led-terapia", "pes-pernas"], 790, 1000, ["Luz vermelha e infravermelha para os pés", "Painel ajustável", "Sessões programáveis"]],
  ["fortalecedor-unhas-led", "Fortalecedor de Unhas com LED", ["led-terapia", "cuidados"], 179, 400, ["Luz LED para o cuidado das unhas", "Uso rápido de poucos minutos", "Recarregável"]],
  ["terapia-capilar-4-em-1", "Aparelho de Terapia Capilar 4 em 1", ["led-terapia", "cuidados"], 597, 800, ["LED vermelho, vibração e calor no couro cabeludo", "Pente que distribui o tratamento", "Recarregável"]],
];

export const PRODUCTS: Product[] = ROWS.map(([slug, name, categories, price, compareAt, bullets, featured]) => ({
  slug,
  name,
  categories,
  price,
  ...(compareAt && compareAt > price ? { compareAt } : {}),
  bullets,
  ...(featured ? { featured } : {}),
}));

export const getProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
export const getCategory = (id: string) => CATEGORIES.find((c) => c.id === id);
export const productsIn = (id: CategoryId) => PRODUCTS.filter((p) => p.categories.includes(id));
export const discountPct = (p: Product) => (p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0);

export const brl = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Parcelamento exibido nos cards (12x com juros do cartão, como na loja de referência). */
export const INSTALLMENTS = 12;
export const installment = (price: number) => (price * 1.1341) / INSTALLMENTS;
