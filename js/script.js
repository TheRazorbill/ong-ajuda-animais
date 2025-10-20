document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navLinks = document.getElementById('main-nav-links');

    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', () => {
            const isOpen = navLinks.classList.toggle('is-open');
            mobileMenuButton.setAttribute('aria-expanded', isOpen);
            const newLabel = isOpen ? 'Fechar menu' : 'Abrir menu';
            mobileMenuButton.setAttribute('aria-label', newLabel);
        });
    }
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        const sections = document.querySelectorAll('.form-section');
        const steps = document.querySelectorAll('.step-indicator');
        let currentSection = 1;

        const cpfMask = IMask(document.getElementById('cpf'), { mask: '000.000.000-00' });
        const phoneMask = IMask(document.getElementById('phone'), { mask: '(00) 00000-0000' });
        const cepMask = IMask(document.getElementById('cep'), { mask: '00000-000' });

        // --- API ViaCEP ---
        const cepInput = document.getElementById('cep');
        cepInput.addEventListener('blur', async () => {
            const cep = cepMask.unmaskedValue;
            if (cep.length === 8) {
                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    if (!response.ok) throw new Error('CEP não encontrado');
                    const data = await response.json();
                    if (data.erro) {
                        showError(cepInput, 'CEP não encontrado.');
                    } else {
                        document.getElementById('street').value = data.logradouro;
                        document.getElementById('neighborhood').value = data.bairro;
                        document.getElementById('city').value = data.localidade;
                        document.getElementById('state').value = data.uf;
                        document.getElementById('number').focus(); // Foca no campo de número
                    }
                } catch (error) {
                    showError(cepInput, 'Não foi possível buscar o CEP.');
                }
            }
        });

        // --- Funções de UI e Validação ---
        const updateUI = () => { /* ...código de antes... */ };

        const showError = (input, message) => {
            input.classList.add('input-error');
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }
        };

        const hideError = (input) => {
            input.classList.remove('input-error');
            const errorDiv = input.nextElementSibling;
            if (errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.style.display = 'none';
            }
        };

        const validateSection = (sectionNum) => {
            const section = document.getElementById(`section${sectionNum}`);
            const inputs = section.querySelectorAll('input[required], select[required]');
            let isValid = true;

            inputs.forEach(input => {
                hideError(input);
                if (!input.value.trim()) {
                    isValid = false;
                    showError(input, 'Este campo é obrigatório.');
                } else if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
                    isValid = false;
                    showError(input, 'Por favor, insira um email válido.');
                } else if (input.id === 'cpf' && cpfMask.unmaskedValue.length !== 11) {
                    isValid = false;
                    showError(input, 'Por favor, insira um CPF válido.');
                } else if (input.id === 'phone' && phoneMask.unmaskedValue.length < 10) {
                    isValid = false;
                    showError(input, 'Por favor, insira um telefone válido.');
                }
            });
            return isValid;
        };

        const updateReviewPane = () => { /* ...código de antes... */ };

        // --- Event Listeners ---
        registrationForm.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-btn')) {
                if (validateSection(currentSection)) {
                    if (currentSection === 3) { // Antes de ir para a confirmação
                        updateReviewPane();
                    }
                    currentSection++;
                    updateUI();
                }
            } else if (e.target.classList.contains('prev-btn')) {
                currentSection--;
                updateUI();
            }
        });

        registrationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Formulário enviado com sucesso!');
            currentSection = 5; // Vai para a tela de sucesso
            updateUI();
        });

    }
});