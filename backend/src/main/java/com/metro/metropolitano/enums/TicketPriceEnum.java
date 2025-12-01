package com.metro.metropolitano.enums;

public enum TicketPriceEnum {
    BEN_THANH(new int[]{0, 7, 7, 7, 7, 7, 7, 9, 10, 12, 14, 16, 18, 20}),
    NHA_HAT_TP(new int[]{7, 0, 7, 7, 7, 7, 7, 8, 10, 11, 13, 16, 18, 20}),
    BA_SON(new int[]{7, 7, 0, 7, 7, 7, 7, 8, 9, 10, 12, 14, 16, 18}),
    VAN_THANH(new int[]{7, 7, 7, 0, 7, 7, 7, 7, 8, 9, 10, 13, 14, 17}),
    TAN_CANG(new int[]{7, 7, 7, 7, 0, 7, 7, 7, 7, 8, 9, 12, 13, 16}),
    THAO_DIEN(new int[]{7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 8, 9, 12, 14}),
    AN_PHU(new int[]{7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 8, 9, 13}),
    RACH_CHIEC(new int[]{9, 8, 8, 7, 7, 7, 7, 0, 7, 7, 7, 7, 8, 11}),
    PHUOC_LONG(new int[]{10, 10, 9, 8, 7, 7, 7, 7, 0, 7, 7, 7, 7, 10}),
    BINH_THAI(new int[]{12, 11, 10, 9, 8, 7, 7, 7, 7, 0, 7, 7, 7, 8}),
    THU_DUC(new int[]{14, 13, 12, 10, 9, 8, 7, 7, 7, 7, 0, 7, 7, 7}),
    KHU_CNC(new int[]{16, 16, 14, 13, 12, 9, 8, 7, 7, 7, 7, 0, 7, 7}),
    DH_QUOC_GIA(new int[]{18, 18, 16, 14, 13, 12, 9, 8, 7, 7, 7, 7, 0, 7}),
    BX_SUOI_TIEN(new int[]{20, 20, 18, 17, 16, 14, 13, 11, 10, 8, 7, 7, 7, 0});

    private final int[] prices;

    TicketPriceEnum(int[] prices) {
        this.prices = prices;
    }

    public int[] getPrices() {
        return prices;
    }
}