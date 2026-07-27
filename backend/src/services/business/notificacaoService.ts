import { Notificacao } from "../../models/NotificacaoModel";

export async function notificacoesRecebidas(usuarioId: string)
{
    const notificacoes = await Notificacao.find({idUsuario: usuarioId});

    console.log(notificacoes);

    return notificacoes;
}

export async function notificacoesEnviadas(usuarioRemetenteId: string)
{
    const notificacoes = await Notificacao.find({idRemetente: usuarioRemetenteId});

    console.log(notificacoes);

    return notificacoes;
}

export async function notificarSolicitacaoAceita(idRemetente: string, idDestinatario: string) : Promise<void>
{
    const notificacao = new Notificacao({
        idNotificao: Date.now(),
        idUsuario: idDestinatario,
        idRemetente: idRemetente,
        titulo: 'Solicitação de ajuda',
        mensagem: 'A solicitação foi aceita!',
        tipo: 'SOLICITACAO',
        lida: false,
        dataEnvio: Date.now()
    })

    console.log("Notificação enviada com sucesso!");
    console.log(notificacao);

    await notificacao.save();
}