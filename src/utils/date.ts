export function humanDate()
{
    const date = new Date();

    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        minute: 'numeric'
    });
}