# Instalação — lojavidu

Este pacote já está pronto: loja para os clientes (`index.html`) e painel do dono (`admin.html`).
Falta só ligar ao banco de dados (Firebase) e publicar. Siga na ordem.

## 1. Firebase (banco de dados)

1. https://console.firebase.google.com → **Adicionar projeto** (nome livre).
2. **Firestore Database** → *Criar banco de dados* → modo **produção** → local **São Paulo (`southamerica-east1`)**.
   (A pasta `functions` já está configurada para essa mesma região. Se escolher outro local, mude a constante `REGIAO` em `functions/index.js`.)
3. **Authentication → Sign-in method**: ative os **três** métodos abaixo (a loja usa os três):
   - **Anônimo** (cada visitante ganha uma identidade para fazer pedidos);
   - **Google** (o cliente pode guardar o histórico de pedidos);
   - **E-mail/senha** (é o acesso do dono ao painel).
   Depois, em **Users → Adicionar usuário**: e-mail `admin@lojavidu.com` e a senha que o dono vai usar no painel.
4. **Configurações do projeto → Seus apps → </> (Web)**: registre o app (os dados já estão no `config.js`).
5. **Firestore Database → Regras**: apague o que estiver lá, cole o conteúdo do arquivo `firestore.rules` deste pacote e clique em **Publicar**.
   Essas regras só deixam o e-mail `admin@lojavidu.com` administrar a loja e protegem os pedidos de cada cliente.
6. **Authentication → Settings → User actions**: desmarque **Enable create (sign-up)** (o dono não usa cadastro por e-mail; o cliente entra como anônimo ou com Google).
7. A chave VAPID dos avisos já está no `config.js`.

## 2. Publicar o site (precisa ser https)
Escolha uma opção:
- **Netlify (mais simples):** app.netlify.com/drop → arraste a pasta inteira.
- **GitHub Pages:** suba os arquivos em um repositório e ative o Pages.
- **Firebase Hosting:** com o Node instalado, rode `npm i -g firebase-tools`, `firebase login` e, dentro desta pasta, `firebase deploy --only hosting,firestore:rules`.

Depois, no Firebase: **Authentication → Settings → Domínios autorizados** → adicione o endereço do site (sem isso o login com Google não abre).

- Loja dos clientes: `https://SEU-ENDERECO/`
- Painel do dono: `https://SEU-ENDERECO/admin.html` (senha do passo 1.3)

## 3. Avisos de pedido novo no celular (opcional, mas recomendado)
O painel avisa com som quando está aberto. Para receber o aviso **com o painel fechado**, publique a função da pasta `functions`:
1. O projeto precisa estar no plano **Blaze** (pago conforme o uso; para uma loja pequena o custo costuma ser zero ou centavos).
2. Com o Node 20 instalado: `npm i -g firebase-tools`, `firebase login` e, dentro desta pasta, `firebase deploy --only functions`.
3. No painel, toque em **🔔 Ativar avisos** em cada aparelho do dono e depois em **🔧 Testar** (ele mostra em qual etapa algo falha).
No iPhone, instale o painel na tela de início (Compartilhar → Adicionar à Tela de Início) antes de ativar os avisos.

## 4. Primeiro uso (painel → `admin.html`)
1. **Ajustes da loja**: WhatsApp, local e horário de retirada, taxa padrão de entrega, taxa por bairro, frete grátis e as mensagens enviadas ao cliente.
2. **Uber Flash**: o cliente escolhe entre Entrega, Uber Flash ou Retirar na loja. No Uber Flash o cliente chama o motoboy pelo app do Uber, sem digitar endereço: ele vê o endereço da loja e paga só os produtos por Pix. Dá para ligar/desligar a opção na seção UBER FLASH do painel.
3. **Pix**: **cadastre sua chave Pix** (ainda não foi informada) e toque em *Salvar Pix*.
4. **Produtos**: cadastre cada peça com foto, preço, categoria e a **quantidade por tamanho** (0 = esgotado). Tamanhos desta loja: P, M, G, GG, XG, Único.
5. Faça um pedido de teste pela loja e acompanhe: o estoque é **reservado** quando o cliente faz o pedido, **baixa** quando você confirma e **volta** se você cancelar.
6. Apague o pedido de teste (botão *Excluir*).

## 5. Como o painel funciona
- **Pedidos**: Confirmar → Em separação → Saiu para entrega → **Entregue**. Cada mudança oferece abrir o WhatsApp com a mensagem pronta.
- **Relatórios**: a receita conta **somente pedidos Entregues**. Cancelados e em andamento ficam de fora.
- **Venda manual**: botão *Registrar venda manual*, para quem comprou fora do site. Já entra como Entregue e dá baixa no estoque.
- **Clientes**: quem visitou, quem se cadastrou e quem já comprou (só pedidos entregues contam como compra).

## Se algo der errado
- *"permission-denied" / pedido não envia*: as regras do passo 1.5 não foram publicadas (ou o e-mail do admin é diferente do que está no `config.js`).
- *Login com Google não abre*: falta o domínio em Domínios autorizados (passo 2) ou o método Google não foi ativado (passo 1.3).
- *Painel não entra*: confira se o usuário `admin@lojavidu.com` existe em Authentication → Users e se o método E-mail/senha está ativo.
- *Mudou um arquivo e nada mudou no site*: use Ctrl+Shift+R. O site guarda cópia para funcionar como aplicativo; aumente o número da versão em `sw.js` (`lojavidu-v1` → `lojavidu-v2`).
- *Avisos não chegam*: toque em **🔧 Testar** no painel; ele aponta a etapa que falhou.

## Dados desta instalação
- Loja: lojavidu
- WhatsApp: 5585996870852
- E-mail do admin: admin@lojavidu.com
- Tamanhos: P, M, G, GG, XG, Único
- Versão do sistema: 2026.10.8
