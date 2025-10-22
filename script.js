const itens = document.querySelectorAll('.item');
const esteira = document.querySelector('#esteira');
const total = document.querySelector('#total');
const btnFinalizar = document.querySelector('#finalizar');
const fala = document.querySelector('#fala');
const somBip = document.querySelector('#som-bip');

class Produto {
  constructor(nome, preco, estoque, imagem, elementoHTML) {
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque;
    this.estoqueInicial = estoque;
    this.imagem = imagem;
    this.elementoHTML = elementoHTML;
  }

  passarNaEsteira(esteira, caixa, totalSpan) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('produto-esteira');

    const img = document.createElement('img');
    img.src = this.imagem;
    img.alt = this.nome;

    const info = document.createElement('div');
    info.classList.add('produto-info');
    info.innerHTML = `<p class="nome">${this.nome}</p>
                      <p class="preco">R$ ${this.preco.toFixed(2)}</p>`;

    const btnRemover = document.createElement('button');
    btnRemover.classList.add('remover');
    btnRemover.textContent = '×';

    btnRemover.addEventListener('click', () => {
      itemDiv.remove();

      this.estoque++;
      if (this.estoque > this.estoqueInicial) {
        this.estoque = this.estoqueInicial;
      }
      this.atualizarSpanEstoque();

      this.elementoHTML.classList.remove('esgotado');
      this.elementoHTML.style.opacity = '1';

      caixa.removerProduto(this);
      caixa.atualizarTotal(totalSpan);

      fala.querySelector('.texto').textContent = `Removendo ${this.nome} da compra...`;
    });

    itemDiv.appendChild(img);
    itemDiv.appendChild(info);
    itemDiv.appendChild(btnRemover);
    esteira.appendChild(itemDiv);
  }

  atualizarEstoque() {
    this.estoque--;
    this.atualizarSpanEstoque();

    if (this.estoque <= 0) {
      this.elementoHTML.classList.add('esgotado');
      this.elementoHTML.style.opacity = '0.5';
      fala.querySelector('.texto').textContent = `Ih, o produto ${this.nome} acabou no estoque!`;
    }
  }

  atualizarSpanEstoque() {
    const span = this.elementoHTML.querySelector('.estoque-item span');
    if (span) {
      span.textContent = this.estoque;
    }
  }

  resetar() {
    this.estoque = this.estoqueInicial;
    this.atualizarSpanEstoque();
    this.elementoHTML.classList.remove('esgotado');
    this.elementoHTML.style.opacity = '1';
  }
}

class Caixa {
  constructor() {
    this.produtos = [];
  }

  adicionarProduto(produto, esteira, totalSpan) {
    if (produto.estoque <= 0) {
      fala.querySelector('.texto').textContent = `Ih, o produto ${produto.nome} acabou no estoque!`;
      return;
    }

    produto.passarNaEsteira(esteira, this, totalSpan);
    produto.atualizarEstoque();

    somBip.currentTime = 0;
    somBip.play();

    this.produtos.push(produto);
    this.atualizarTotal(totalSpan);
    fala.querySelector('.texto').textContent = `Passando ${produto.nome}...`;
  }

  removerProduto(produto) {
    const index = this.produtos.indexOf(produto);
    if (index !== -1) {
      this.produtos.splice(index, 1);
    }
  }

  atualizarTotal(totalSpan) {
    let totalCompra = 0;
    this.produtos.forEach(p => {
      totalCompra += p.preco;
    });
    totalSpan.textContent = `R$ ${totalCompra.toFixed(2)}`;
    return totalCompra;
  }

  finalizarCompra(esteira, totalSpan) {
    if (this.produtos.length === 0) {
      fala.querySelector('.texto').textContent = "O carrinho está vazio! Adicione algum item antes de finalizar a compra.";
      return;
    }

    const totalFinal = this.atualizarTotal(totalSpan);
    fala.querySelector('.texto').textContent = `O total deu R$ ${totalFinal.toFixed(2)}. Obrigada pela compra! 😊`;

    esteira.innerHTML = '';
    this.produtos = [];
    totalSpan.textContent = 'R$ 0,00';

    Object.values(produtosMap).forEach(produto => {
      produto.resetar();
    });
  }
}

const caixa = new Caixa();

const produtosMap = {};

itens.forEach(item => {
  const nome = item.dataset.nome;
  const preco = parseFloat(item.dataset.preco);
  const estoque = parseInt(item.dataset.estoque);
  const imagem = item.querySelector('img').src;

  const produto = new Produto(nome, preco, estoque, imagem, item);
  produtosMap[nome] = produto;

  item.dataset.estoqueInicial = estoque;

  item.addEventListener('click', () => {
    caixa.adicionarProduto(produtosMap[nome], esteira, total);
  });
});

btnFinalizar.addEventListener('click', () => {
  caixa.finalizarCompra(esteira, total);
});
