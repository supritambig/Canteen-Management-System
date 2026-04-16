package com.canteen.controller;

import com.canteen.dto.OrderRequest;
import com.canteen.model.MenuItem;
import com.canteen.model.Order;
import com.canteen.model.OrderItem;
import com.canteen.model.User;
import com.canteen.repository.MenuItemRepository;
import com.canteen.repository.OrderRepository;
import com.canteen.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if(userOpt.isEmpty()) return ResponseEntity.badRequest().body("User not found");

        Order order = new Order();
        order.setUser(userOpt.get());
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("PREPARING");
        
        double total = 0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (Map.Entry<Long, Integer> entry : request.getItems().entrySet()) {
            Optional<MenuItem> itemOpt = menuItemRepository.findById(entry.getKey());
            if (itemOpt.isPresent()) {
                MenuItem mi = itemOpt.get();
                if(mi.getStockQuantity() == null || mi.getStockQuantity() < entry.getValue()) {
                    return ResponseEntity.badRequest().body("Not enough stock for " + mi.getName());
                }
                
                // Deduct stock
                mi.setStockQuantity(mi.getStockQuantity() - entry.getValue());
                if(mi.getStockQuantity() == 0) mi.setAvailable(false);
                menuItemRepository.save(mi);

                OrderItem oi = new OrderItem();
                oi.setOrder(order);
                oi.setMenuItem(mi);
                oi.setQuantity(entry.getValue());
                orderItems.add(oi);
                total += mi.getPrice() * entry.getValue();
            }
        }
        
        User user = userOpt.get();
        if (user.getBalance() == null || user.getBalance() < total) {
            return ResponseEntity.badRequest().body("Insufficient funds. Please top up your wallet.");
        }
        
        user.setBalance(user.getBalance() - total);
        userRepository.save(user);

        order.setItems(orderItems);
        order.setTotalPrice(total);
        
        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderRepository.findByUserIdOrderByOrderTimeDesc(userId);
    }

    @GetMapping("/admin/all")
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderTimeDesc();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return orderRepository.findById(id).map(order -> {
            order.setStatus(status);
            orderRepository.save(order);
            return ResponseEntity.ok(order);
        }).orElse(ResponseEntity.notFound().build());
    }
}
