"use client";

export default function RegisterPage() {
  async function handleSubmit(e: any) {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "/dashboard";
    } else {
      alert(data.error);
    }
  }

  return (
    <div className="w-full max-w-md animate-[fadeIn_.5s_ease-out]">
      <div className="text-center mb-6">
        <a href="/login" className="text-gray-400 hover:text-white mb-4 inline-block">
          <i className="fas fa-arrow-left mr-2"></i>Voltar
        </a>
        <h1 className="title-font text-4xl text-white">CRIAR CONTA</h1>
      </div>

      <div className="glass-card rounded-2xl p-8 shadow-2xl border border-white/10">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-white mb-1 font-medium">Nome Completo</label>
            <input name="name" className="custom-input w-full px-4 py-3 rounded-lg text-white bg-gray-800/40 border border-gray-700" required />
          </div>

          <div>
            <label className="block text-white mb-1 font-medium">Email</label>
            <input type="email" name="email" className="custom-input w-full px-4 py-3 rounded-lg text-white bg-gray-800/40 border border-gray-700" required />
          </div>

          <div>
            <label className="block text-white mb-1 font-medium">Senha</label>
            <input type="password" name="password" className="custom-input w-full px-4 py-3 rounded-lg text-white bg-gray-800/40 border border-gray-700" required />
          </div>

          <button type="submit" className="btn-primary w-full py-3 rounded-lg text-white font-bold text-lg">
            CRIAR CONTA
          </button>
        </form>
      </div>
    </div>
  );
}
