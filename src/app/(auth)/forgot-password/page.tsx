"use client";

export default function ForgotPasswordPage() {
  async function handleSubmit(e: any) {
    e.preventDefault();
    alert("Função futura: enviar email de recuperação.");
  }

  return (
    <div className="w-full max-w-md animate-[fadeIn_.5s_ease-out]">

      <div className="text-center mb-6">
        <a href="/login" className="text-gray-400 hover:text-white mb-4 inline-block">
          <i className="fas fa-arrow-left mr-2"></i>Voltar
        </a>
        <h1 className="title-font text-4xl text-white">RECUPERAR SENHA</h1>
      </div>

      <div className="glass-card rounded-2xl p-8 shadow-2xl border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white mb-1 font-medium">Email</label>
            <input type="email" name="email" className="custom-input w-full px-4 py-3 rounded-lg text-white bg-gray-800/40 border border-gray-700" required />
          </div>

          <button type="submit" className="btn-primary w-full py-3 rounded-lg text-white font-bold text-lg">
            ENVIAR RECUPERAÇÃO
          </button>
        </form>
      </div>
    </div>
  );
}
