import { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const PaymentResult = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { verifyPlan } = useContext(AuthContext); 
    
    const [isSuccess, setIsSuccess] = useState(true);
    const [paymentId, setPaymentId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const processPayment = async () => {
            const status = searchParams.get('status') || searchParams.get('collection_status');
            const id = searchParams.get('payment_id') || searchParams.get('collection_id');

            const success = status === 'approved';
            setIsSuccess(success);
            if (id) setPaymentId(id);

            if (success) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                await verifyPlan();
            }
            
            setLoading(false);
        };

        processPayment();
    }, [searchParams, verifyPlan]);

    if (loading) {
        return <div className="payment-loading">Verificando estado de tu suscripción...</div>;
    }

    return (
        <div className="payment-container">
            <div className="payment-card">
                {isSuccess ? (
                    <div className="payment-content success">
                        <CheckCircle className="icon" size={64} strokeWidth={1.5} />
                        <h1 className="titulo-pago">¡Felicidades!</h1>
                        <p>Tu pago ha sido procesado con éxito en <strong>NemoGym</strong>.</p>
                        
                        {paymentId && (
                            <div className="payment-receipt">
                                <strong>Comprobante MP:</strong> #{paymentId}
                                <span><Clock size={14} /> Tu plan ya está activo.</span>
                            </div>
                        )}
                        <button className="btn-action" onClick={() => navigate('/dashboard')}>
                            Ir a mi Panel
                        </button>
                    </div>
                ) : (
                    <div className="payment-content error">
                        <XCircle className="icon" size={64} strokeWidth={1.5} />
                        <h1>Pago no realizado</h1>
                        <p>Hubo un problema o la transacción fue cancelada. No se realizó ningún cargo.</p>
                        <button className="btn-action secondary" onClick={() => navigate('/membresias')}>
                            Volver a intentar
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentResult;