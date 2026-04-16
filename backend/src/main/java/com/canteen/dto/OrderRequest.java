package com.canteen.dto;

import lombok.Data;
import java.util.Map;

@Data
public class OrderRequest {
    private Long userId;
    // Map of MenuItemId -> Quantity
    private Map<Long, Integer> items;
}
