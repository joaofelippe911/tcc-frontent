export function formatCpf(cpf) {
    return cpf.replace(/\D/g, '')
        .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3-\$4");;
}