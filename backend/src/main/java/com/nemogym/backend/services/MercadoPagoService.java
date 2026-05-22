package com.nemogym.backend.services;

import com.mercadopago.client.preference.PreferenceBackUrlsRequest;
import com.mercadopago.client.preference.PreferenceClient;
import com.mercadopago.client.preference.PreferenceItemRequest;
import com.mercadopago.client.preference.PreferenceRequest;
import com.mercadopago.exceptions.MPApiException;
import com.mercadopago.exceptions.MPException;
import com.mercadopago.resources.preference.Preference;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Service
public class MercadoPagoService {

        @Value("${app.webhook-url}")
        private String webhookBaseUrl;

        @Value("${app.frontend-url}")
        private String frontendBaseUrl;

        public Map<String, String> crearPreferencia(String titulo, Double precio, String pagoInternoId)
                        throws MPException, MPApiException {

                BigDecimal precioFormateado = new BigDecimal(precio.toString())
                                .setScale(2, java.math.RoundingMode.HALF_UP);

                PreferenceItemRequest item = PreferenceItemRequest.builder()
                                .title(titulo)
                                .quantity(1)
                                .currencyId("ARS")
                                .unitPrice(precioFormateado)
                                .build();

                PreferenceBackUrlsRequest backUrls = PreferenceBackUrlsRequest.builder()
                                .success(frontendBaseUrl + "/payment-success")
                                .failure(frontendBaseUrl + "/payment-failure")
                                .pending(frontendBaseUrl + "/payment-pending")
                                .build();

                String urlCompletaWebhook = webhookBaseUrl + "/mercadopago/webhook";
                PreferenceRequest preferenceRequest = PreferenceRequest.builder()
                                .items(List.of(item))
                                .backUrls(backUrls)
                                .autoReturn("approved")
                                .notificationUrl(urlCompletaWebhook)
                                .externalReference(pagoInternoId)
                                .build();

                PreferenceClient client = new PreferenceClient();
                Preference preference = client.create(preferenceRequest);

                return Map.of(
                                "id", preference.getId(),
                                "initPoint", preference.getInitPoint());
        }
}