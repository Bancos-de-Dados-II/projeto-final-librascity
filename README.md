<div align="center" > 

<h1> 📍 Libras City </h1>
<p>Mãos conectadas✋</p>

<h2>Objetivo do projeto</h2>
<p>O Libras City é um projeto acadêmico desenvolvido no Instituto Federal de Educação, Ciência e Tecnologia da Paraíba (IFPB) – Campus Cajazeiras, com o propósito de promover a inclusão, a acessibilidade e a valorização da comunidade surda por meio da tecnologia.

O projeto consiste em utilizar a localização em tempo real da pessoa com deficiência auditiva para identificar e recomendar os estabelecimentos mais preparados para atender esse público, considerando critérios de acessibilidade e atendimento inclusivo.

Além disso, o Libras City busca conectar pessoas surdas a intérpretes de Língua Brasileira de Sinais (Libras), facilitando a comunicação em situações do cotidiano e contribuindo para a redução das barreiras de interação em diferentes ambientes.

Dessa forma, o projeto integra recursos de geolocalização, acessibilidade e comunicação em uma única plataforma, fortalecendo a inclusão social e promovendo uma melhor experiência para a comunidade surda.
</p>

<h2>Equipe do projeto</h2>

<p> José Antonio, Wendell, Francieverton e João Victor</p>

<h2>🚀 Como executar o projeto</h2>

<h3>1. Clone o repositório ou crie um fork</h3>

<pre><code>git clone https://github.com/Bancos-de-Dados-II/projeto-final-librascity.git
</code></pre>

<h3>2. Instale as dependências</h3>

<pre><code>npm install
</code></pre>

<h3>3. Configure o arquivo <code>.env</code></h3>

<p>
Antes de iniciar a aplicação, copie o arquivo <code>.env.example</code> e o modifiquei para <code>.env</code>, localizado na raiz do projeto.
</p>
<pre><code>
PORT=
NODE_ENV="development"
MONGO_URI=
POSTGRES_URI=
REDIS_URI=
JWT_SECRET=
</code></pre>

<h4>OBS: Indicicamos no você gerar o JWT_SECRET pelo o terminal é só iniciar o node e rodar o comando abaixo: </h4>
<pre><code>
  console.log(require('crypto').randomBytes(32).toString('hex'))
</code></pre>

> ira ser gerado uma uma chave que você poderá usar no JWT_SECRET

<h3>4. Execute o projeto</h3>

<p>
Após configurar corretamente o arquivo <code>.env</code>, execute o seguinte comando na <strong>pasta raiz</strong> do projeto:
</p>

<pre><code>npm run dev
</code></pre>

<h2>🛠 Tecnologias</h2>

<p>HTML, CSS, JavaScript, TypeScript e NodeJS</p>

<h2> Banco de Dados</h2>

<p>MongoDB, Redis e Postgres</p>




</div>


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/NZVyGR9C)
