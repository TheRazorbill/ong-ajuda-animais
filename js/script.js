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
                    }
                } catch (error) {
                    showError(cepInput, 'Não foi possível buscar o CEP.');
                    console.error("Erro ao buscar CEP:", error);
                }
            }
        });

        const updateUI = () => {
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(`section${currentSection}`).classList.add('active');

            steps.forEach((step, index) => {
                const stepNum = index + 1;
                step.classList.remove('active', 'completed');
                if (stepNum < currentSection) {
                    step.classList.add('completed');
                } else if (stepNum === currentSection) {
                    step.classList.add('active');
                }
            });
        };
        
        const showError = (input, message) => {
            input.classList.add('input-error');
            const errorDiv = input.nextElementSibling;
            if(errorDiv && errorDiv.classList.contains('error-message')) {
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
            }
        };

        const hideError = (input) => {
             input.classList.remove('input-error');
            const errorDiv = input.nextElementSibling;
            if(errorDiv && errorDiv.classList.contains('error-message')) {
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
        
        const updateReviewPane = () => {
            document.getElementById('reviewFullName').textContent = document.getElementById('fullName').value;
            document.getElementById('reviewEmail').textContent = document.getElementById('email').value;
            document.getElementById('reviewCpf').textContent = document.getElementById('cpf').value;
            document.getElementById('reviewPhone').textContent = document.getElementById('phone').value;
            document.getElementById('reviewBirthDate').textContent = new Date(document.getElementById('birthDate').value + 'T00:00:00').toLocaleDateString('pt-BR');
            document.getElementById('reviewGender').textContent = document.getElementById('gender').value || 'Não informado';

            document.getElementById('reviewCep').textContent = document.getElementById('cep').value;
            document.getElementById('reviewStreet').textContent = document.getElementById('street').value;
            document.getElementById('reviewNumber').textContent = document.getElementById('number').value;
            document.getElementById('reviewComplement').textContent = document.getElementById('complement').value || 'N/A';
            document.getElementById('reviewNeighborhood').textContent = document.getElementById('neighborhood').value;
            document.getElementById('reviewCityState').textContent = `${document.getElementById('city').value} - ${document.getElementById('state').value}`;

            const helpTypes = Array.from(document.querySelectorAll('input[name="helpTypes"]:checked')).map(cb => cb.value).join(', ');
            document.getElementById('reviewHelpTypes').textContent = helpTypes || 'Nenhum selecionado';
            document.getElementById('reviewAvailability').textContent = document.getElementById('availability').value || 'Não informado';
            document.getElementById('reviewSkills').textContent = document.getElementById('skills').value || 'Não informado';
        };

        registrationForm.addEventListener('click', (e) => {
            if (e.target.classList.contains('next-btn')) {
                if (validateSection(currentSection)) {
                    if (currentSection === 3) {
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
            console.log('Formulário enviado!');
            currentSection = 5; 
            updateUI();
        });
    }
});