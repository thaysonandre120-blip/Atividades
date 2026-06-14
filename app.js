// Aponta para a porta onde o seu Node.js (Backend) está escutando
const API_URL = 'http://127.0.0.1:3000/api';   // <- mudado de localhost para 127.0.0.1

// ==========================================
// 1. BUSCAR E RENDERIZAR UNIDADES
// ==========================================
async function carregarUnidades() {
    const grid = document.getElementById('grid-unidades');
    const select = document.getElementById('unidade_id');

    try {
        const response = await fetch(`${API_URL}/unidades`);
        const unidades = await response.json();
        
        grid.innerHTML = ''; 

        unidades.forEach(uc => {
            select.innerHTML += `<option value="${uc.id}">${uc.nome}</option>`;

            grid.innerHTML += `
                <div class="uc-card" style="background: white; border: 1px solid #ddd; padding: 20px; border-radius: 8px; display: flex; flex-direction: column;">
                    <h3 style="margin-top: 0; color: #2c3e50;">${uc.nome}</h3>
                    <div style="font-size: 0.9em; color: #555; margin-bottom: 5px;"><b>Tipo:</b> ${uc.tipo}</div>
                    <div style="font-size: 0.9em; color: #555; margin-bottom: 15px;"><b>Cidade:</b> ${uc.cidade}</div>
                    
                    <button onclick="carregarComunicacoes(${uc.id})" style="margin-top: auto; background: #3498db; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold;">Ver Relatos</button>
                    
                    <div id="comunicacoes-${uc.id}" style="margin-top: 15px; font-size: 0.85em; background: #f4f6f8; padding: 10px; display: none; border-radius: 4px;"></div>
                </div>
            `;
        });
    } catch (error) {
        console.error("Erro crítico na comunicação com a API:", error);
        grid.innerHTML = '<p style="color:red; font-weight:bold;">Falha de comunicação. O servidor Node.js (server.js) está rodando no terminal?</p>';
    }
}

// ==========================================
// 2. ENVIAR NOVA COMUNICAÇÃO (POST)
// ==========================================
document.getElementById('form-comunicacao').addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const payload = {
        unidade_id: document.getElementById('unidade_id').value,
        titulo: document.getElementById('titulo').value,
        email_comunicante: document.getElementById('email').value,
        descricao: document.getElementById('descricao').value
    };

    try {
        const response = await fetch(`${API_URL}/comunicacoes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Relato salvo com sucesso no banco de dados!');
            document.getElementById('form-comunicacao').reset();
        } else {
            alert('Erro no servidor ao tentar salvar o relato.');
        }
    } catch (error) {
        alert('Erro de rede: Não foi possível alcançar a API.');
        console.error(error);
    }
});

// ==========================================
// 3. BUSCAR RELATOS DE UMA UNIDADE ESPECÍFICA
// ==========================================
async function carregarComunicacoes(id) {
    const div = document.getElementById(`comunicacoes-${id}`);
    div.style.display = 'block';
    div.innerHTML = 'Buscando relatos no banco...';

    try {
        const response = await fetch(`${API_URL}/comunicacoes/${id}`);
        const comunicacoes = await response.json();

        if (comunicacoes.length === 0) {
            div.innerHTML = '<i>Nenhum relato registrado para esta unidade ainda.</i>';
            return;
        }

        let html = '<ul style="padding-left: 20px; margin: 0;">';
        comunicacoes.forEach(c => {
            html += `<li style="margin-bottom: 8px;">
                        <strong>${c.titulo}</strong><br>
                        ${c.descricao} <br>
                        <span style="color: #7f8c8d; font-size: 0.9em;">Por: ${c.email_comunicante}</span>
                     </li>`;
        });
        html += '</ul>';
        div.innerHTML = html;

    } catch (error) {
        console.error("Erro ao buscar relatos:", error);
        div.innerHTML = '<span style="color:red;">Erro ao processar dados.</span>';
    }
}

// ==========================================
// IGNIÇÃO
// ==========================================
carregarUnidades();